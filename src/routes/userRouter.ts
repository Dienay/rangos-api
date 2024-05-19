import { Router, Request, Response } from 'express';

export const userRouter = Router();

userRouter.get('/user', (req: Request, res: Response) => {
  res.json({ message: 'Rota de usuário' });
});
