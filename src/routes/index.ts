import { RouterProps, RequestProps, ResponseProps } from '@/config';
import { establishmentRouter } from './establishmentRouter';
import { productsRouter } from './productRouter';
import { userRouter } from './userRouter';

// Function to define API routes
const routes = (app: RouterProps) => {
  // Route for the root endpoint '/'
  app.route('/').get((req: RequestProps, res: ResponseProps) => {
    res.status(200).json({
      // Sending a welcome message as JSON response
      message: 'Welcome to the Clone Rappi API.'
    });
  });

  // Using the imported routers
  app.use(establishmentRouter, productsRouter, userRouter);
};

export default routes;
