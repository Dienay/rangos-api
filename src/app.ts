// Importing necessary modules and configurations
import { app, logger, env } from './config';
import routes from './routes';
import run from './config/dbConnect';
import handlesErrors from './middlewares/handlesErrors';
import error404 from './middlewares/handlesError404';
import { initRedis } from './config/redis';

// Start the application
async function startApp() {
  try {
    await run();
    await initRedis();

    // Setting up routes
    routes(app);

    // Handling 404 errors
    app.use(error404);
    // Handling other errors
    app.use(handlesErrors);

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
});
