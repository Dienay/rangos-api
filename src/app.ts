import { app, logger, env } from '@/config';
import './config/module-alias';
import routes from './routes';
import run from './config/dbConnect';
import handlesErrors from './middlewares/handlesErrors';
import error404 from './middlewares/handlesError404';

run()
  .then(() => {
    routes(app);

    app.use(error404);

    app.use(handlesErrors);

    app.listen(env.port, () => {
      logger.info(`Server running on http://localhost:${env.port}`);
    });
  })
  .catch((err) => {
    logger.error('Failed to connect to the database:', err);
  });
