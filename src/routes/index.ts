import express, { Router, Request, Response } from 'express';
import * as path from 'path';
import { authRouter } from './authRouter';
import { establishmentRouter } from './establishmentRouter';
import { productsRouter } from './productRouter';
import { userRouter } from './userRouter';
import { orderRouter } from './orderRouter';

const routes = (app: Router) => {
  app.route('/').get((req: Request, res: Response) => {
    res.status(200).json({
      message: 'Welcome to the Rangos API.'
    });
  });

  app.use(authRouter, establishmentRouter, productsRouter, userRouter, orderRouter);
  app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'uploads')));
};

export default routes;
