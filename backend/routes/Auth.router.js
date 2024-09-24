const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const Cart = require('../models/Cart.model')
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Check if user already has a cart
    let cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      // If no cart exists, create a new one with zero products
      cart = new Cart({
        userId: user._id,
        items: [],
        totalPrice: 0
      });
      await cart.save();
    }

    res.status(200).json({ token, message: 'Login successful, cart created/checked' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;