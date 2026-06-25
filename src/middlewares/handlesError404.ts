import { Request, Response, NextFunction } from 'express';
import NotFound from '../errors/NotFound';

function error404(_req: Request, _res: Response, next: NextFunction) {
  next(new NotFound());
}

export default error404;
