import { RouterProps, RequestProps, ResponseProps } from '@/config';
import { establishmentRouter } from './establishmentRouter';
import { productsRouter } from './productRouter';
import { userRouter } from './userRouter';

const routes = (app: RouterProps) => {
  app.route('/').get((req: RequestProps, res: ResponseProps) => {
    res.status(200).json({
      message: 'Welcome to the Clone Rappi API.'
    });
  });

  app.use(establishmentRouter, productsRouter, userRouter);
};

export default routes;
