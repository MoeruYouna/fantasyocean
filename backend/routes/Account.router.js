const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Account = require('../models/Account.model');

// Get all accounts (existing route)
router.get('/', async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific account by custom ID (existing route)
router.get('/account/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const account = await Account.findOne({ name: name });
    if (account) {
      res.json(account);
    } else {
      res.status(404).json({ message: 'Account not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new account (existing route)
router.post('/', async (req, res) => {
  const account = new Account({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password,
  });

  try {
    const newAcc = await account.save();
    res.status(201).json(newAcc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
