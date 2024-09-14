const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Account = require('../models/Account.model');

router.post('/', async (req, res) => {
   const { emailOrUsername, password} = req.body;
    try {
        const account = await Account.findOne({
            $or: [{ emai: emailOrUsername }, { password: password }]
        });

        if (!account){
            return res.status(400).json({ message: 'Invalid email/username !'});
        }

        const isMatch = await bcrypt.compare(password, account.password);

        if(!isMatch){
            return res.status(400).json({ message: 'Invalid password !'});
        }

        const token = jwt.sign({ id: account._id}, 'your_jwt_secret', {expiresIn: '1h' });
        console.log("Success !")

        res.json({ token });
   } catch (err){
        res.status(500).json({ message: err.message });
   }
});

module.exports = router;
