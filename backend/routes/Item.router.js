const express = require('express');
const router = express.Router();
const Item = require('../models/Item.model');
const Category = require('../models/Category_I.model')

router.get('/', async (req, res) => {
  const { category } = req.query;

  try {
    let items;

    if (category && category !== 'ALL') {
      const foundCategory = await Category.findOne({ name: category });
      if (!foundCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }

      items = await Item.find({ catID: foundCategory.id });
    } else {
      items = await Item.find();
    }

    
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`Received request for item ID: ${req.params.id}`);
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
  const { name, categoryName, image, description, price, quantity } = req.body;

  if (price <= 0 || quantity <= 0) {
    return res.status(400).json({ message: 'Price and quantity must be non-negative.' });
  }

  try {
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const item = new Item({
      name,
      catID: category._id,
      image,
      description,
      price,
      quantity
    });

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

router.put('/:id', async (req, res) => {
  const { id } = req.params; 
  const { name, categoryName, image, description, price, quantity } = req.body;

  // Validate that price and quantity are non-negative
  if (price <= 0 || quantity <= 0) {
    return res.status(400).json({ message: 'Price and quantity must be non-negative.' });
  }

  try {
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      id,  
      {
        name,
        catID: category._id,
        image,
        description,
        price,
        quantity,
      },
      { new: true } 
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
