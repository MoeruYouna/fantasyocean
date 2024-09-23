const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const mongoose = require('mongoose');
const Cart = require('../models/Cart.model');
const Fish = require('../models/Fish.model');
const User = require('../models/User.model')

// Helper function to validate ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Add item to cart route
router.post('/cart', authMiddleware, async (req, res) => {
    const { fishID, quantity } = req.body;
    const userId = req.user.userId;    

    if (!isValidObjectId(fishID)) {
      return res.status(400).json({ error: "Invalid fishID format" });
    }
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    try {
      let cart = await Cart.findOne({ userId });
      const fish = await Fish.findById(fishID);

      if (!fish) {
        return res.status(404).json({ error: "Fish not found" });
      }

      if (!cart) {
        // Create a new cart if none exists
        cart = new Cart({ userId, items: [], totalPrice: 0 });
      }

      const itemIndex = cart.items.findIndex(item => item.fishId.equals(fishID));

      if (itemIndex > -1) {
        // Fish exists in the cart, update the quantity and price
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].price = cart.items[itemIndex].quantity * fish.price;
      } else {
        // Add a new fish item to the cart
        cart.items.push({
          fishId: fishID,
          quantity,
          price: fish.price * quantity,
        });
      }

      // Recalculate total price
      cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);

      // Save the updated cart
      await cart.save();
      res.status(201).json(cart);

    } catch (err) {
      console.error("Error while adding to cart:", err);  // Log the actual error
      res.status(500).json({ error: 'An error occurred while adding to the cart.' });
    }
});

// Get cart for user route
router.get('/:userID', async (req, res) => {
  const { userID } = req.params;

  // Validate userID
  if (!isValidObjectId(userID)) {
    return res.status(400).json({ error: "Invalid userID format" });
  }

  try {
    const cart = await Cart.findOne({ userId: userID }).populate('items.fishId');
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart.items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete item from cart route
router.delete('/:userID/item/:fishID', async (req, res) => {
  const { userID, fishID } = req.params;

  // Validate userID and fishID
  if (!isValidObjectId(userID)) {
    return res.status(400).json({ error: "Invalid userID format" });
  }
  if (!isValidObjectId(fishID)) {
    return res.status(400).json({ error: "Invalid fishID format" });
  }

  try {
    const cart = await Cart.findOne({ userId: userID });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item.fishId.equals(fishID));
    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);  // Remove the item from the cart
      cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);  // Recalculate total price
      await cart.save();
      return res.status(200).json({ message: "Item removed from cart successfully." });
    } else {
      return res.status(404).json({ message: "Item not found in cart!" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:userID/item/:fishID', async (req, res) => {
  const { userID, fishID } = req.params;
  const { quantity } = req.body;

  // Validate userID and fishID
  if (!isValidObjectId(userID)) {
    return res.status(400).json({ error: "Invalid userID format" });
  }
  if (!isValidObjectId(fishID)) {
    return res.status(400).json({ error: "Invalid fishID format" });
  }

  if (quantity < 1) {
    return res.status(400).json({ error: "Quantity must be at least 1" });
  }

  try {
    const cart = await Cart.findOne({ userId: userID });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find((item) => item.fishId.equals(fishID));
    if (item) {
      // Update the quantity and price
      const fish = await Fish.findById(fishID);
      if (!fish) {
        return res.status(404).json({ error: "Fish not found" });
      }

      item.quantity = quantity;
      item.price = fish.price * quantity;

      // Recalculate total price
      cart.totalPrice = cart.items.reduce((total, item) => total + item.price, 0);

      await cart.save();
      return res.status(200).json({ message: "Quantity updated successfully." });
    } else {
      return res.status(404).json({ message: "Item not found in cart!" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
