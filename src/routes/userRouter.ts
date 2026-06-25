import { Router } from 'express';
import checkToken from '../middlewares/checkToken';
import { usersUpload } from '../config/multer';
import UserController from '../controllers/userController';
import { addressRouter } from './addressRouter';
import { orderRouter } from './orderRouter';

export const userRouter = Router();

const { getUserById, updateUser, deleteUser } = UserController;
userRouter.get('/user/:id', checkToken, getUserById);
userRouter.put('/user/:id', usersUpload.single('avatar'), checkToken, updateUser);
userRouter.delete('/user/:id', checkToken, deleteUser);
userRouter.use('/user', addressRouter);
userRouter.use('/user', orderRouter);
