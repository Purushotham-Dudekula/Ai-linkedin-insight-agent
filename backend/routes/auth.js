import express from 'express';
import jwt from 'jsonwebtoken';
import { createUser, verifyPassword } from '../utils/userDB.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * POST /api/auth/signup
 * Create a new user account
 */
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Invalid password',
        message: 'Password must be at least 6 characters long'
      });
    }

    // Create user
    const user = await createUser(email, password, name || email.split('@')[0]);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Error in /api/auth/signup:', error);
    res.status(400).json({
      error: 'Signup failed',
      message: error.message || 'An error occurred during signup'
    });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email and password are required'
      });
    }

    // Verify user
    const user = await verifyPassword(email, password);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Error in /api/auth/login:', error);
    res.status(500).json({
      error: 'Login failed',
      message: error.message || 'An error occurred during login'
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user (protected route)
 */
router.get('/me', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    res.json({
      success: true,
      data: {
        userId: decoded.userId,
        email: decoded.email
      }
    });
  } catch (error) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    });
  }
});

export default router;

