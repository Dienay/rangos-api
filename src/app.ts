// Importing necessary modules and configurations
import { app } from './config';
import routes from './routes';
import handlesErrors from './middlewares/handlesErrors';
import error404 from './middlewares/handlesError404';

// Setting up routes
routes(app);

// Handling 404 errors
app.use(error404);
// Handling other errors
app.use(handlesErrors);

export default app;
