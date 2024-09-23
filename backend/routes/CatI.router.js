const express = require('express');
const CatF = require('../models/Category_I.model');

const router = express.Router();

// Route to get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await CatF.find(); // Fetch all categories from MongoDB
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error });
    }
});

router.post('/', async (req, res) => {
    try {
        const newCategory = new CatF({
            name: req.body.name // Expect the category name to be in the request body
        });

        const savedCategory = await newCategory.save(); // Save to MongoDB
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error adding category', error });
    }
});


module.exports = router;
