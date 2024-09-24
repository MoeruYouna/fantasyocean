const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const mongoose = require('mongoose');
const Cart = require('../models/Cart.model');
const Fish = require('../models/Fish.model');
const Item = require('../models/Item.model');

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function findProductById(productId, productType) {
  if (productType === 'Fish') {
    return await Fish.findById(productId);
  } else if (productType === 'Item') {
    return await Item.findById(productId);
  }
  return null;
}

// Example backend API route for adding to cart
router.post('/cart', authMiddleware, async (req, res) => {
  const { productId, quantity, productType } = req.body;
  const userId = req.user?.userId;

  try {
    const product = await findProductById(productId, productType);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [], totalPrice: 0 });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.equals(productId) && item.productType === productType);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].price = cart.items[itemIndex].quantity * product.price;
    } else {
      cart.items.push({
        productId,
        productType,
        quantity,
        price: product.price * quantity,
      });
    }

    cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);
    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ error: 'An error occurred while adding to the cart.' });
  }
});

router.get('/:userID', async (req, res) => {
  const { userID } = req.params;

  if (!isValidObjectId(userID)) {
    return res.status(400).json({ error: "Invalid userID format" });
  }

  try {
    // Dynamically populate based on productType
    const cart = await Cart.findOne({ userId: userID }).populate({
      path: 'items.productId',
      select: 'name description price image', // Populate the necessary fields
    });
    console.log(cart);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart.items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Delete product (fish or item) from cart
router.delete('/:userID/product/:productId/:productType', async (req, res) => {
  const { userID, productId, productType } = req.params;

  // Validate userID and productId
  if (!isValidObjectId(userID)) {
    return res.status(400).json({ error: "Invalid userID format" });
  }
  if (!isValidObjectId(productId)) {
    return res.status(400).json({ error: "Invalid productId format" });
  }

  try {
    const cart = await Cart.findOne({ userId: userID });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.equals(productId) && item.productType === productType);
    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);  // Remove the item from the cart
      cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);  // Recalculate total price
      await cart.save();
      return res.status(200).json({ message: "Product removed from cart successfully." });
    } else {
      return res.status(404).json({ message: "Product not found in cart!" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update quantity for product (fish or item) in cart
router.put('/:userID/product/:productId/:productType', async (req, res) => {
  const { userID, productId, productType } = req.params;
  const { quantity } = req.body;

  // Validate userID and productId
  if (!isValidObjectId(userID)) {
    return res.status(400).json({ error: "Invalid userID format" });
  }
  if (!isValidObjectId(productId)) {
    return res.status(400).json({ error: "Invalid productId format" });
  }

  if (quantity < 1) {
    return res.status(400).json({ error: "Quantity must be at least 1" });
  }

  try {
    const cart = await Cart.findOne({ userId: userID });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(item => item.productId.equals(productId) && item.productType === productType);
    if (item) {
      // Update the quantity and price
      const product = await findProductById(productId, productType);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      item.quantity = quantity;
      item.price = product.price * quantity;

      // Recalculate total price
      cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);

      await cart.save();
      return res.status(200).json({ message: "Quantity updated successfully." });
    } else {
      return res.status(404).json({ message: "Product not found in cart!" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
