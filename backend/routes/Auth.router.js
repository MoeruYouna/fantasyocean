const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const Acc = require('../models/Account.model')
const User = require('../models/User.model')
const router = express.Router();

console.log('JWT_SECRET:', process.env.JWT_SECRET);

router.post('/register', async (req, res) => {
  const { email, name, password } = req.body;

  try {
    account = new Acc({
      email,
      name,
      password,
    });

    const savedAcc = await account.save();

    // Create a corresponding user profile
    const user = new User({
      name: account.name,
      accID: savedAcc._id,
      age: 0,
      address: '',
      avt: '',
      description: '',
      role: 'user',
    });

    const savedUser = await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: savedAcc._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token, account: savedAcc, user: savedUser });
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
      // Find the account by email
      const account = await Acc.findOne({ email });
      if (!account) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Check if the password matches
      const isMatch = await bcrypt.compare(password, account.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: account._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
  
      // Find the user profile linked to the account
      const user = await User.findOne({ accID: account._id });
      if (!user) {
        return res.status(404).json({ message: 'User profile not found' });
      }
  
      res.json({ token, account, user });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Failed to log in' });
    }
});  
module.exports = router;