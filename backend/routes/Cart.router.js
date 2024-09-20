const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Cart = require('../models/Cart.model');
const Fish = require('../models/Fish.model');

// Add item to cart (protected route)
router.post('/cart', authMiddleware, async (req, res) => {
    const { fishID, quantity } = req.body;
    const userId = req.user.userId;  // Get the logged-in user's ID from the token
  
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

module.exports = router;
