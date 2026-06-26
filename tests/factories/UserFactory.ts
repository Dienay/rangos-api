import { User, IUser } from '@/models';
import bcrypt from 'bcrypt';

type UserOverrides = Partial<IUser>;

export class UserFactory {
  static async create(overrides?: UserOverrides) {
    const password = overrides?.password || '123456';

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      avatar: overrides?.avatar || null,
      name: overrides?.name || 'Test User',
      email: overrides?.email || `user${Date.now()}@test.com`,
      phone: overrides?.phone || `86${Math.floor(Math.random() * 10000000)}`,
      password: hashedPassword,
      address: overrides?.address || [],
      typeUser: overrides?.typeUser || 'Customer'
    };

    const user = await User.create(userData);

    return {
      user,
      plainPassword: password
    };
  }
}
