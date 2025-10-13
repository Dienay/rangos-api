import { initRedis } from '../config/redis';
import { app, logger } from '../config';
import routes from '../routes';
import run from '../config/dbConnect';
import handlesErrors from '../middlewares/handlesErrors';
import error404 from '../middlewares/handlesError404';

async function start() {
  try {
    await initRedis();
    await run();
    routes(app);
    app.use(error404);
    app.use(handlesErrors);
  } catch (error) {
    logger.error('Error initializing app:', error);
  }
}

start().catch((error) => {
  logger.error('Error starting app:', error);
});

export default app;
