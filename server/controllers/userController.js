import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import knex from 'knex';
import { development } from '../../knexfile.js';
const db = knex(development)


// Register user
export async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;
  try {
    // Check if user already exists
    const userExists = await db('users').where('email', email).first();
    if (userExists) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to DB
    await db('users').insert({ name, email, password: hashedPassword, role: 'customer' });

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
}

// Login user
export async function login(req, res) {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await db('users').where('email', email).first();
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', { expiresIn: '1d' });

    res.json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
}

// Get user profile
export async function getProfile(req, res) {
  try {
    const user = await db('users').where('id', req.user.id).first();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ name: user.name, email: user.email, address: user.address });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error });
  }
}

// Update user profile
export async function updateProfile(req, res) {
  const { name, email } = req.body;

  try {
    // Update user info in DB
    await db('users').where('id', req.user.id).update({ name, email });
    res.json({ message: 'Profile updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error });
  }
}
