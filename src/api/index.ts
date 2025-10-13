import { initRedis } from 'src/config/redis';
import { app, logger } from '../config';
import routes from '../routes';
import run from '../config/dbConnect';
import handlesErrors from '../middlewares/handlesErrors';
import error404 from '../middlewares/handlesError404';

async function start() {
  await initRedis();
  await run();

  // Registra as rotas imediatamente
  routes(app);

  // Middlewares globais
  app.use(error404);
  app.use(handlesErrors);
}

start().catch((error) => {
  logger.error('Error starting app:', error);
});
