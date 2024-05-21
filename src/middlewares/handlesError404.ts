import { Request, Response, NextFunction } from 'express';
import NotFound from '../errors/NotFound';

// Error handling middleware for 404 Not Found errors
function error404(req: Request, res: Response, next: NextFunction) {
  // Creating a new instance of the NotFound error
  const error = new NotFound();

  // Passing the NotFound error to the next middleware or error handler
  next(error);
}

export default error404;
