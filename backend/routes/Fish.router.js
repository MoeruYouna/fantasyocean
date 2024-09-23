  const express = require('express');
  const router = express.Router();
  const Fish = require('../models/Fish.model');
  const Category = require('../models/Category_F.model'); 

  // Get all fish, with optional filtering by category
  router.get('/', async (req, res) => {
    const { category } = req.query; // Get the category query parameter

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

  // Create a new fish
  router.post('/', async (req, res) => {
    const { name, categoryName, image, description, price, quantity } = req.body;

    try {
      // Find category by name
      const category = await Category.findOne({ name: categoryName });
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      // Create new Fish with the found Category's ObjectId
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

  // Delete a fish by ID
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

  module.exports = router;
