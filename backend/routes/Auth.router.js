const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const Acc = require('../models/Account.model')
const User = require('../models/User.model')
const router = express.Router();

console.log('JWT_SECRET:', process.env.JWT_SECRET);

router.post('/register', async  (req, res) => {
    const {email, name, password} = req.body;

    try {
        const existingUser = await Acc.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
    const newUser = new Acc({ email, name, password });
    await newUser.save();

    res.status(201).json({ message: 'Register successfully !'});
    } catch (err){
    res.status(500).json({ message: ' Register Failed '});
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Acc.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'Account not exists !' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Wrong Password !' });
        }

        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
          throw new Error('JWT_SECRET is not defined');
        }    

        const token = jwt.sign({ userId: user._id}, secretKey, {
            expiresIn: '1h',
        });

        let user_login = await User.findOne({ accID: acc._id });
        if (!user_login) {
            user = new User({ accID: acc._id, name: acc.name, age: 0 }); // Adjust as necessary
        await user.save();
        }

        res.json({ token, user });

    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: 'Server error !'})
    }
});

module.exports = router;