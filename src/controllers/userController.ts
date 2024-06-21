import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser } from '@/models/User';
import NotFound from '@/errors/NotFound';
import { User } from '@/models/index';
import { RequestProps, ResponseProps, NextFunctionProps, env, logger } from '@/config';
import path from 'path';
import fs from 'fs';

class UserController {
  // Method for user signup
  static signup = async (
    req: RequestProps,
    res: ResponseProps,
    next: NextFunctionProps
  ): Promise<void | ResponseProps> => {
    try {
      const body = req.body as IUser;

      // Check if a user with the same email or phone already exists
      const emailExists = await User.findOne({ email: body.email }).select('-password');
      const phoneExists = await User.findOne({ phone: body.phone }).select('-password');

      if (emailExists) {
        return res.status(409).json({
          message: 'Email already exists.'
        });
      }

      if (phoneExists) {
        return res.status(409).json({
          message: 'Phone already exists.'
        });
      }

      if (req.file) {
        body.avatar = req.file.filename;
      }

      // Validate the new user data against the schema
      const validationError = new User(req.body).validateSync();

      if (validationError) {
        // If validation fails, passing the error to the error handling middleware
        return next(validationError);
      }

      // Generate a salt and hash the password
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(body.password, salt);

      // Create a new user with the hashed password
      const newUser = await User.create({
        avatar: body.avatar,
        name: body.name,
        email: body.email,
        phone: body.phone,
        password: passwordHash
      });

      const { secret } = env;

      // Generate a JWT token for the user
      const token = jwt.sign(
        {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-underscore-dangle
          id: newUser._id
        },
        secret
      );

      return res.status(201).json({
        message: 'User created successfully.',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-underscore-dangle
        _id: newUser._id,
        avatar: body.avatar,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        token
      });
    } catch (error) {
      // Pass any errors to the error handling middleware
      return next(error);
    }
  };

  // Method for user login
  static login = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    const { email, password } = req.body as { email: string; password: string };

    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.'
      });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: 'User not found.'
      });
    }

    // Check if the provided password matches the stored password
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(422).json({
        message: 'Incorrect password.'
      });
    }

    try {
      const { secret } = env;

      // Generate a JWT token for the user
      const token = jwt.sign(
        {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-underscore-dangle
          id: user._id
        },
        secret
      );

      // Send a success response with the generated token
      return res.status(200).json({
        message: 'User logged in successfully.',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-underscore-dangle
        _id: user._id,
        token
      });
    } catch (error) {
      return next(error);
    }
  };

  // Method to get user by ID
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getUserById = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      const { id } = req.params;

      // Find the user by ID, excluding the password field
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-underscore-dangle
        user: { _id: user._id, avatar: user.avatar, name: user.name, email: user.email, phone: user.phone }
      });
    } catch (error) {
      return next(error);
    }
  };

  // Method to update user
  static updateUser = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      const { id } = req.params;
      const newData = req.body as Partial<IUser>;

      // Find the user by ID, excluding the password field
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

      // // Update the user with the provided data
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: { avatar: newData.avatar, name: newData.name, email: newData.email, phone: newData.phone } },
        { new: true }
      ).select('-password');

      if (!updatedUser) {
        return next(new NotFound('Product Id not found.'));
      }

      return res.status(200).json({
        message: 'User updated already.',
        user: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-underscore-dangle
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

  // Method to delete user
  static deleteUser = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      const { id } = req.params;
      // Find and delete the user by ID, excluding the password field
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
