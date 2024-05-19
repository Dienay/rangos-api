import { Router, Request, Response } from 'express';
import { establishmentRouter } from './establishmentRouter';
import { productsRouter } from './productRouter';
import { userRouter } from './userRouter';

const routes = (app: Router) => {
  app.route('/').get((req: Request, res: Response) => {
    res.status(200).json({
      message: 'Welcome to the Clone Rappi API.'
    });
  });

  app.use(establishmentRouter, productsRouter, userRouter);
};

export default routes;
