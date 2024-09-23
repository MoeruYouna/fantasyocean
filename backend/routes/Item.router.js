const express = require('express');
const router = express.Router();
const Item = require('../models/Item.model');

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/item/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findById(id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const item = new Item({
    name: req.body.name,
    category: req.body.category,
    image: req.body.image,
    description: req.body.description,
    price: req.body.price,
    quantity: req.body.quantity,
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/item/delete/:_id', async (req, res) => {
  const { _id } = req.params;
  try {
    const deletedItem = await Item.findOneAndDelete({ _id });
    if (deletedItem) {
      res.status(200).json({ message: 'Item deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Item not found.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
