import { app, logger } from '../config';
import routes from '../routes';
import run from '../config/dbConnect';
import handlesErrors from '../middlewares/handlesErrors';
import error404 from '../middlewares/handlesError404';

// Inicializa o banco apenas uma vez
run()
  .then(() => {
    routes(app);
    app.use(error404);
    app.use(handlesErrors);
  })
  .catch((err) => {
    logger.error('Database connection error:', err);
  });

// Exporta o app para que o Vercel saiba lidar
export default app;
