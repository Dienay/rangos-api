import path from 'path';
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import { NotFound } from '@/errors';
import { logger } from '../config';
import { IUser } from '../models/User';
import { User } from '../models/index';

class UserController {
  static getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const user = await User.findById(id).select('-password');

      if (user) {
        user.avatar = `${req.protocol}://${req.get('host')}/uploads/users/${user.avatar}`;
      }

      if (!user) {
        return res.status(404).json({
          message: 'User not found.'
        });
      }

      return res.status(200).json({
        user: { _id: user._id, avatar: user.avatar, name: user.name, email: user.email, phone: user.phone }
      });
    } catch (error) {
      return next(error);
    }
  };

  static updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const newData = req.body as Partial<IUser>;

      const userFound = await User.findById(id).select('-password');

      if (!userFound) {
        throw new NotFound('User not found.');
      }

      if (req.file) {
        if (userFound.avatar) {
          const avatarPath = path.join(__dirname, '..', '..', 'uploads', 'users', path.basename(userFound.avatar));

          if (fs.existsSync(avatarPath)) {
            try {
              fs.unlinkSync(avatarPath);
            } catch (unlinkError) {
              logger.error(`Error deleting file: ${(unlinkError as Error).message}`);
              return next(new Error('Error deleting old image file.'));
            }
          }
        }

        newData.avatar = req.file.filename;
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: { avatar: newData.avatar, name: newData.name, email: newData.email, phone: newData.phone } },
        { new: true }
      ).select('-password');

      if (!updatedUser) {
        return next(new NotFound('User not found.'));
      }

      return res.status(200).json({
        message: 'User updated already.',
        user: {
          _id: updatedUser._id,
          avatar: updatedUser.avatar,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone
        }
      });
    } catch (error) {
      return next(error);
    }
  };

  static deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userFound = await User.findByIdAndDelete(id).select('-password');

      if (userFound !== null) {
        res.status(200).json({
          message: 'User deleted successfully',
          data: userFound
        });
      } else {
        next(new NotFound('User not found'));
      }
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
