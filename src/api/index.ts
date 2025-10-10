import { app, logger } from '../config';
import routes from '../routes';
import run from '../config/dbConnect';
import handlesErrors from '../middlewares/handlesErrors';
import error404 from '../middlewares/handlesError404';

// Registra as rotas imediatamente
routes(app);

// Middlewares globais
app.use(error404);
app.use(handlesErrors);

// Conecta ao banco em background
run()
  .then(() => {
    logger.info('✅ Database connected successfully');
  })
  .catch((err) => {
    logger.error('❌ Database connection error:', err);
  });

// Exporta o app (sem .listen)
export default app;
