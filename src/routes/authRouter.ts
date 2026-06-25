import { Router } from 'express';
import { usersUpload } from '../config/multer';
import AuthController from '@/controllers/authController';

export const authRouter = Router();

const { signup, login } = AuthController;
authRouter.post('/signup', usersUpload.single('avatar'), signup);
authRouter.post('/login', login);
