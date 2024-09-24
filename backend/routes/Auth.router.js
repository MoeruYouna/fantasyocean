const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const Cart = require('../models/Cart.model')
const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, name, password, age, address, avt, description } = req.body;

  try {
    const lowerCaseEmail = email.toLowerCase();
 
    let user = await User.findOne({ email: lowerCaseEmail });
    if (user) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    user = new User({
      email: lowerCaseEmail,
      name,
      password,
      age,
      address,
      avt,
      description,
      role: 'user',
    });

    const savedUser = await user.save();

    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token, user: savedUser });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email is already registered' });
    }
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

// Auth Controller - Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create a JWT token with user role
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send role in the response
    res.status(200).json({ token, role: user.role, message: 'Login successful' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;