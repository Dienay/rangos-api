import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ConflictError, UnprocessableError } from '@/errors';
import { Request, Response, NextFunction } from 'express';
import { env } from '../config';
import { IUser } from '../models/User';
import { User } from '../models/index';

class AuthController {
  static signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as IUser;

      const emailExists = await User.findOne({ email: body.email }).select('-password');
      if (emailExists) {
        return next(new ConflictError('Email already exists.'));
      }

      const phoneExists = await User.findOne({ phone: body.phone }).select('-password');
      if (phoneExists) {
        return next(new ConflictError('Phone already exists.'));
      }

      if (req.file) {
        body.avatar = req.file.filename;
      }

      const validationError = new User(req.body).validateSync();
      if (validationError) return next(validationError);

      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(body.password, salt);

      const newUser = await User.create({
        avatar: body.avatar,
        name: body.name,
        email: body.email,
        phone: body.phone,
        typeUser: body.typeUser,
        password: passwordHash
      });

      const token = jwt.sign({ id: newUser._id }, env.secret, { expiresIn: '7d' });

      return res.status(201).json({
        message: 'User created successfully.',
        _id: newUser._id,
        avatar: newUser.avatar,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        typeUser: newUser.typeUser,
        token
      });
    } catch (error) {
      return next(error);
    }
  };

  static login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as { email: string; password: string };

      if (!email) {
        return next(new UnprocessableError('Email is required.'));
      }

      if (!password) {
        return next(new UnprocessableError('Password is required.'));
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return next(new UnprocessableError('Invalid email format.'));
      }

      const user = await User.findOne({ email });
      if (!user) {
        return next(new UnprocessableError('User not found.'));
      }

      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        return next(new UnprocessableError('Incorrect password.'));
      }

      const token = jwt.sign({ id: user._id }, env.secret, { expiresIn: '7d' });

      return res.status(200).json({
        message: 'User logged in successfully.',
        _id: user._id,
        token
      });
    } catch (error) {
      return next(error);
    }
  };
}

export default AuthController;
