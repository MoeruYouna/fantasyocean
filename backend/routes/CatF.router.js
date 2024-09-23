const express = require('express');
const CatF = require('../models/Category_F.model');

const router = express.Router();

// Route to get all categories
router.get('/categoriesF', async (req, res) => {
    try {
        const categories = await CatF.find(); 
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error });
    }
});

router.post('/categoriesF', async (req, res) => {
    try {
        const newCategory = new CatF({
            name: req.body.name 
        });

        const savedCategory = await newCategory.save(); 
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error adding category', error });
    }
});


module.exports = router;
