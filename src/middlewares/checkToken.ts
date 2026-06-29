import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { env } from '../config';
import { UnauthorizedError, NotFound } from '../errors';
import { Establishment, User } from '../models';

const checkToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new UnauthorizedError('Access denied. No token provided.'));
  }
  try {
    const { secret } = env;

    const decoded = jwt.verify(token, secret) as { id: string };
    const entity = (await User.findById(decoded.id)) || (await Establishment.findById(decoded.id));

    if (!entity) {
      return next(new NotFound('Entity token error.'));
    }

    next();
  } catch (error) {
    return next(new UnauthorizedError('Invalid token'));
  }
};

export default checkToken;
