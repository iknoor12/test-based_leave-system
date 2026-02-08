import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const createToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

export const register = async (req, res) => {
  try {
    const { name, email, password, role, passkey } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    if (role === 'admin') {
      if (!passkey || passkey !== process.env.ADMIN_PASSKEY) {
        return res.status(401).json({ message: 'Invalid admin passkey.' });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash, role });
    const token = createToken(user);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, passkey } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    if (user.role === 'admin') {
      if (!passkey || passkey !== process.env.ADMIN_PASSKEY) {
        return res.status(401).json({ message: 'Invalid admin passkey.' });
      }
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = createToken(user);

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed.' });
  }
};
