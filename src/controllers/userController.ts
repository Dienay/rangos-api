import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser } from '@/models/User';
import NotFound from '@/errors/NotFound';
import { Address } from '@/models/Address';
import { User } from '@/models/index';
import { RequestProps, ResponseProps, NextFunctionProps, env } from '@/config';

class UserController {
  // Method for user signup
  static signup = async (
    req: RequestProps,
    res: ResponseProps,
    next: NextFunctionProps
  ): Promise<void | ResponseProps> => {
    try {
      const { name, email, phone, password } = req.body as IUser;

      // Check if a user with the same email or phone already exists
      const userExists = await User.findOne({ $or: [{ email }, { phone }] }).select('-password');

      if (userExists) {
        return res.status(409).json({
          message: 'User already exists.'
        });
      }

      // Validate the new user data against the schema
      const validationError = new User(req.body).validateSync();

      if (validationError) {
        // If validation fails, passing the error to the error handling middleware
        return next(validationError);
      }

      // Generate a salt and hash the password
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      // Create a new user with the hashed password
      const newUser = await User.create({
        name,
        email,
        phone,
        password: passwordHash
      });

      const userResponse = {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-underscore-dangle
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone
      };

      return res.status(201).json({
        message: 'User created successfully.',
        data: userResponse
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

      if (!user) {
        return res.status(404).json({
          message: 'User not found.'
        });
      }

      return res.status(200).json({
        data: user
      });
    } catch (error) {
      return next(error);
    }
  };

  static updateUser = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      const { id } = req.params;
      const { avatar, name, email, phone, address } = req.body as {
        avatar: string;
        name: string;
        email: string;
        phone: string;
        address: Address[];
      };

      const userFound = await User.findById(id).select('-password');

      if (!userFound) {
        return res.status(404).json({
          message: 'User not found.'
        });
      }

      // // Update the user with the provided data
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: { avatar, name, email, phone, address } },
        { new: true }
      ).select('-password');

      if (!updatedUser) {
        return next(new NotFound('Product Id not found.'));
      }

      return res.status(200).json({
        message: 'User updated already.',
        data: updatedUser
      });
    } catch (error) {
      return next(error);
    }
  };

  static deleteUser = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
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
