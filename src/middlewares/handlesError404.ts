import { Request, Response, NextFunction } from 'express';
import NotFound from '../errors/NotFound';

function error404(req: Request, res: Response, next: NextFunction) {
  const erro404 = new NotFound();
  next(erro404);
}

export default error404;
