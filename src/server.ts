// Importing necessary modules and configurations
import app from './app';
import run from './config/dbConnect';
import { initRedis } from './config/redis';
import { env, logger } from './config';

// Start the application
async function startApp() {
  try {
    await run();
    await initRedis();

    // Starting the server
    app.listen(env.port, () => {
      // Logging server start information
      logger.info(`Server running on http://localhost:${env.port}`);
    });
  } catch (err) {
    // Logging database connection failure
    logger.error('Failed to start the app:', err);
  }
}

startApp().catch((error) => {
  logger.error('Error starting app:', error);
  process.exit(1);
});
