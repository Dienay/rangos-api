import jwt from 'jsonwebtoken';
import { RequestProps, ResponseProps, NextFunctionProps, env } from '@/config';

const checkToken = (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Access denied. No token provided.'
    });
  }
  try {
    const { secret } = env;

    jwt.verify(token, secret);

    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }

  return undefined;
};

export default checkToken;
