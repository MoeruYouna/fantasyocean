const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart.model');

// Fetch cart items for a user
router.get('/:userID', async (req, res) => {
    const { userID } = req.params;
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

// Remove item from cart
router.delete('/:userID/item/:fishID', async (req, res) => {
    const { userID, fishID } = req.params;
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

module.exports = router;
