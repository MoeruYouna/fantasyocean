const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const authMiddleware = require('../middleware/auth'); 

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId); 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
});

// Update user's profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, age, address, description, avt } = req.body; 

    const updatedData = { name, age, address, description, avt }; 

    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      updatedData,
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(400).json({ message: 'Failed to update profile' });
  }
});

module.exports = router;
