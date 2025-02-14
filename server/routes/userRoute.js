import { Router } from 'express';
import { body } from 'express-validator';
import authenticate from '../middleware/auth.js';
import { register, login, getProfile, updateProfile } from '../controllers/userController.js';

const userRouter = Router();

// Register route
userRouter.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters long')
  ],
  register
);

// Login route
userRouter.post('/login', login);

// Profile route (Protected)
userRouter.get('/profile', authenticate, getProfile);

// Update Profile route (Protected)
userRouter.put(
  '/profile',
  authenticate,
  [
    body('name').optional().notEmpty().withMessage('Name is required'),
    body('email').optional().isEmail().withMessage('Valid email is required')
  ],
  updateProfile
);

export default userRouter;
