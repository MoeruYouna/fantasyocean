const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Bill = require('../models/Bill.model');
const Cart = require('../models/Cart.model');

// Checkout route (converts cart to bill)
router.post('/', authMiddleware, async (req, res) => {
    const userId = req.user.userId;

    try {
        // Fetch the cart for the user
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty!" });
        }

        // Create a new bill based on the cart
        const bill = new Bill({
            userId,
            items: cart.items,
            totalPrice: cart.totalPrice,
            purchaseDate: new Date()
        });

        // Save the bill
        await bill.save();

        // Clear the cart after checkout
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(201).json({ message: "Checkout successful", bill });
    } catch (err) {
        console.error("Error during checkout:", err);
        res.status(500).json({ message: "An error occurred during checkout", error: err.message });
    }
});

module.exports = router;
