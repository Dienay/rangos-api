import { Router } from 'express';
import checkToken from '../middlewares/checkToken';
import { usersUpload } from '../config/multer';
import UserController from '../controllers/userController';
import { addressRouter } from './addressRouter';
import { orderRouter } from './OrderRouter';

// Create a new router instance
export const userRouter = Router();

// Destructure the required methods from UserController
const { signup, login, getUserById, updateUser, deleteUser } = UserController;
// Define routes
userRouter.post('/signup', usersUpload.single('avatar'), signup);
userRouter.post('/login', login);
// Define routes protected by the checkToken middleware
userRouter.get('/user/:id', checkToken, getUserById);
userRouter.put('/user/:id', usersUpload.single('avatar'), checkToken, updateUser);
userRouter.delete('/user/:id', checkToken, deleteUser);

// Use addressRouter for address-related routes
userRouter.use('/user', addressRouter);

// Use orderRouter for order-related routes
userRouter.use('/user', orderRouter);
