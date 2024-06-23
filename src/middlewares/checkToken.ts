import jwt from 'jsonwebtoken';
import { RequestProps, ResponseProps, NextFunctionProps, env } from '@/config';
import { User } from '@/models';

const checkToken = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Access denied. No token provided.'
    });
  }
  try {
    const { secret } = env;

    const decoded = jwt.verify(token, secret) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }

  return undefined;
};

export default checkToken;
