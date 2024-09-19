const express = require('express');
const router = express.Router();
const User = require('../models/User.model')
const authMiddleware = require('../middleware/auth'); // Middleware to protect routes

// Get logged-in user's profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ accID: req.user.userId }).populate('accID', 'email name'); // Populate the account details
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { accID: req.user.userId }, // Use accID here instead of userId
      { ...req.body },
      { new: true } // Return the updated document
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


module.exports = router;
