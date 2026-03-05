import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const defaultUsers = [
  {
    name: 'System Admin',
    email: 'admin@demo.com',
    password: 'admin',
    role: 'admin'
  },
  {
    name: 'Operations Manager',
    email: 'manager@demo.com',
    password: 'manager',
    role: 'manager'
  },
  {
    name: 'Store Staff',
    email: 'staff@demo.com',
    password: 'staff',
    role: 'staff'
  }
];

export const seedDefaultUsers = async () => {
  for (const account of defaultUsers) {
    const existingUser = await User.findOne({ email: account.email });
    if (existingUser) {
      continue;
    }

    const hashedPassword = await bcrypt.hash(account.password, 10);

    await User.create({
      name: account.name,
      email: account.email,
      password: hashedPassword,
      role: account.role
    });
  }
};
