const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc   Register user
// @route  POST /api/auth/register
// @access Public
exports.register = async (req, res) => {
  try {
    console.log('Register request received:', req.body);
    const { fullName, username, email, password } = req.body;

    // Validate input
    if (!fullName || !username || !email || !password) {
      console.log('Missing required fields:', { fullName, username, email, passwordProvided: !!password });
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields'
      });
    }

    // Check if user already exists
    console.log('Checking if user exists');
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      console.log('User already exists:', userExists.email, userExists.username);
      if (userExists.email === email) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      if (userExists.username === username) {
        return res.status(400).json({ success: false, message: 'Username already taken' });
      }
    }

    // Create user
    console.log('Creating new user');
    const user = new User({
      fullName,
      username,
      email,
      password,
      isVerified: true // Set user as verified by default (no OTP needed)
    });

    // Save user to database
    console.log('Saving user to database');
    const savedUser = await user.save();
    console.log('User saved successfully:', savedUser._id);

    // Generate token
    console.log('Generating JWT token');
    const token = generateToken(savedUser._id);

    console.log('Registration successful, sending response');
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: savedUser._id,
        fullName: savedUser.fullName,
        username: savedUser.username,
        email: savedUser.email,
        profilePicture: savedUser.profilePicture,
        bio: savedUser.bio,
        isVerified: savedUser.isVerified
      }
    });
  } catch (error) {
    console.error('Registration error details:', error);
    console.error('Error stack:', error.stack);
    
    // Check if it's a MongoDB validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      console.error('Validation errors:', messages);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    // Check if it's a MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      console.error('Duplicate key error:', { field, value });
      return res.status(400).json({
        success: false,
        message: `${field} '${value}' is already taken`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user with email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
}; 