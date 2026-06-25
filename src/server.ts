import app from './app';
import run from './config/dbConnect';
import { initRedis } from './config/redis';
import { env, logger } from './config';

async function startApp() {
  try {
    await run();
    await initRedis();

    app.listen(env.port, () => {
      logger.info(`Server running on http://localhost:${env.port}`);
    });
  } catch (err) {
    logger.error('Failed to start the app:', err);
  }
}

startApp().catch((error) => {
  logger.error('Error starting app:', error);
  process.exit(1);
});
