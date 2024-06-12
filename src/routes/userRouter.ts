import { Router } from 'express';
import UserController from '@/controllers/userController';
import checkToken from '@/middlewares/checkToken';
import { usersUpload } from '@/config/multer';

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
