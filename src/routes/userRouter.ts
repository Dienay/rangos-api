import { Router } from 'express';
import UserController from '@/controllers/userController';
import checkToken from '@/middlewares/checkToken';

// Create a new router instance
export const userRouter = Router();

// Destructure the required methods from UserController
const { signup, login, getUserById, updateUser, deleteUser } = UserController;
// Define routes
userRouter.post('/user/signup', signup);
userRouter.post('/user/login', login);
// Define routes protected by the checkToken middleware
userRouter.get('/user/:id', checkToken, getUserById);
userRouter.put('/user/:id', checkToken, updateUser);
userRouter.delete('/user/:id', checkToken, deleteUser);
