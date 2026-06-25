// Importing necessary modules and configurations
import { app } from './config';
import routes from './routes';
import error404 from './middlewares/handlesError404';
import handlesErrors from './middlewares/handlesErrors';

routes(app);

app.use(error404);
app.use(handlesErrors);

export default app;
