import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { requireAdmin, requireAuth } from '../middleware/auth.middleware.js';
import { toSafeUser } from '../utils/auth.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/', async (_req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'name, email and password are required'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: role || 'staff'
    });

    const safeUser = toSafeUser(newUser);

    return res.status(201).json({ success: true, data: safeUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, password } = req.body;

    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (email && email.toLowerCase() !== existingUser.email) {
      const duplicateUser = await User.findOne({ email: email.toLowerCase(), _id: { $ne: id } });
      if (duplicateUser) {
        return res.status(409).json({ success: false, message: 'Email already in use' });
      }
    }

    if (typeof name === 'string') {
      existingUser.name = name;
    }
    if (typeof email === 'string') {
      existingUser.email = email.toLowerCase();
    }
    if (typeof phone === 'string') {
      existingUser.phone = phone;
    }
    if (typeof role === 'string') {
      existingUser.role = role;
    }
    if (typeof password === 'string' && password.trim().length > 0) {
      existingUser.password = await bcrypt.hash(password, 10);
    }

    await existingUser.save();

    return res.status(200).json({ success: true, data: toSafeUser(existingUser) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.auth.sub) {
      return res.status(400).json({ success: false, message: 'Cannot delete current user' });
    }

    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
