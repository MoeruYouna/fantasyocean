const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, name, password, age, address, avt, description } = req.body;

  try {
    // Ensure email is stored in lowercase
    const lowerCaseEmail = email.toLowerCase();

    // Check if the user already exists
    let user = await User.findOne({ email: lowerCaseEmail });
    if (user) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Create a new user
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

    // Generate JWT token
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

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, user });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Failed to log in' });
  }
});

module.exports = router;