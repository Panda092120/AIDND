const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { executeQuery, executeUpdate, getUserByEmailOrUsername, getUserById } = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Input validation helper
const validateInput = (data, requiredFields) => {
  const errors = [];
  
  requiredFields.forEach(field => {
    if (!data[field] || data[field].trim() === '') {
      errors.push(`${field} is required`);
    }
  });
  
  return errors;
};

// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Username validation
const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// POST /api/auth/signup - Register new user
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    
    // Validate input
    const errors = validateInput(req.body, ['username', 'email', 'password']);
    
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        message: errors.join(', ')
      });
    }
    
    // Additional validations
    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email',
        message: 'Please provide a valid email address'
      });
    }
    
    if (!isValidUsername(username)) {
      return res.status(400).json({
        error: 'Invalid username',
        message: 'Username must be 3-20 characters long and contain only letters, numbers, and underscores'
      });
    }
    
    if (!isValidPassword(password)) {
      return res.status(400).json({
        error: 'Invalid password',
        message: 'Password must be at least 6 characters long'
      });
    }
    
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        error: 'Password mismatch',
        message: 'Passwords do not match'
      });
    }
    
    // Check if user already exists
    const existingUser = await getUserByEmailOrUsername(email);
    if (existingUser) {
      return res.status(409).json({
        error: 'User exists',
        message: 'User with this email or username already exists'
      });
    }
    
    const existingUsername = await getUserByEmailOrUsername(username);
    if (existingUsername) {
      return res.status(409).json({
        error: 'Username taken',
        message: 'This username is already taken'
      });
    }
    
    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const result = await executeUpdate(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username.trim(), email.trim().toLowerCase(), passwordHash]
    );
    
    // Generate token
    const token = generateToken(result.lastID);
    
    // Get created user (without password)
    const newUser = await getUserById(result.lastID);
    const { password_hash, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      message: 'User created successfully',
      user: userWithoutPassword,
      token
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'Could not create user account'
    });
  }
});

// POST /api/auth/login - Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    const errors = validateInput(req.body, ['email', 'password']);
    
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        message: errors.join(', ')
      });
    }
    
    // Find user
    const user = await getUserByEmailOrUsername(email.trim());
    
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Invalid email/username or password'
      });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Invalid email/username or password'
      });
    }
    
    // Generate token
    const token = generateToken(user.id);
    
    // Return user without password
    const { password_hash, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'Could not authenticate user'
    });
  }
});

// GET /api/auth/me - Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await getUserById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User account no longer exists'
      });
    }
    
    // Return user without password
    const { password_hash, ...userWithoutPassword } = user;
    
    res.json({
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to get user',
      message: 'Could not retrieve user information'
    });
  }
});

// POST /api/auth/refresh - Refresh token
router.post('/refresh', authMiddleware, async (req, res) => {
  try {
    // Generate new token
    const token = generateToken(req.userId);
    
    res.json({
      message: 'Token refreshed',
      token
    });
    
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Token refresh failed',
      message: 'Could not refresh authentication token'
    });
  }
});

// POST /api/auth/logout - Logout user (client-side token removal)
router.post('/logout', authMiddleware, (req, res) => {
  res.json({
    message: 'Logout successful',
    note: 'Please remove the token from client storage'
  });
});

module.exports = router;