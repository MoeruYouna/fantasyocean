const express = require('express');
const router = express.Router();
const Fish = require('../models/Fish.model');

// Get all fish
router.get('/', async (req, res) => {
  try {
    const fishs = await Fish.find();
    res.json(fishs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific fish by custom ID
router.get('/fish/:id', async (req, res) => {
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
  const fish = new Fish({
    name: req.body.name,
    category: req.body.category,
    image: req.body.image,
    description: req.body.description,
    price: req.body.price,
  });

  try {
    const newFish = await fish.save();
    res.status(201).json(newFish);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/fish/delete/:_id', async (req, res) => {
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
