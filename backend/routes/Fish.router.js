const express = require('express');
const router = express.Router();
const Fish = require('../models/Fish.model');
const Category = require('../models/Category_F.model');

router.get('/', async (req, res) => {
  const { category } = req.query;

  try {
    let fishs;

    if (category && category !== 'All') {
      const foundCategory = await Category.findOne({ name: category });
      if (!foundCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }

      fishs = await Fish.find({ catID: foundCategory._id });
    } else {
      fishs = await Fish.find();
    }

    res.json(fishs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific fish by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const fish = await Fish.findById(id);
    if (fish) {
      res.json(fish);
    } else {
      res.status(404).json({ message: 'Fish not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, categoryName, image, description, price, quantity } = req.body;

  if (price <= 0 || quantity <= 0) {
    return res.status(400).json({ message: 'Price and quantity must be non-negative.' });
  }

  try {
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const fish = new Fish({
      name,
      catID: category._id,
      image,
      description,
      price,
      quantity
    });

    const newFish = await fish.save();
    res.status(201).json(newFish);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/delete/:_id', async (req, res) => {
  const { _id } = req.params;
  try {
    const deletedItem = await Fish.findOneAndDelete({ _id });
    if (deletedItem) {
      res.status(200).json({ message: 'Fish item deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Fish item not found.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params; // Extract 'id' from the URL parameters
  const { name, categoryName, image, description, price, quantity } = req.body;

  // Validate that price and quantity are not negative
  if (price <= 0 || quantity <= 0) {
    return res.status(400).json({ message: 'Price and quantity must be non-negative.' });
  }

  try {
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const updatedFish = await Fish.findByIdAndUpdate(
      id, // Use 'id' from req.params here
      {
        name,
        catID: category._id,
        image,
        description,
        price,
        quantity,
      },
      { new: true } // Return the updated document
    );

    if (!updatedFish) {
      return res.status(404).json({ message: 'Fish not found' });
    }

    res.json(updatedFish);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
