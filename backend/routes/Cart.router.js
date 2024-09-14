const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart.model");
const CartItem = require("../models/CartItem.model");

router.post('/', async(req, res) => {
    try{ 
        const newCart = new Cart();
        const savedCart = await newCart.save();
        res.status(201).json(savedCart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/item', async(req, res) => {
    const {accID, fishID, quantity} = req.body;
    try {
        const newItem = new CartItem({ accID, fishID, quantity });
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/cart', async(req, res) => {
    const {accID, fishID, quantity} = req.body;
    try {
        let cartItem = await CartItem.findOne({accID, fishID});
        if (cartItem) {
            cartItem.quantity += quantity
        } else {
            cartItem = new CartItem({accID, fishID, quantity});
        }

        await cartItem.save();
        res.status(201).json(cartItem);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while adding to the cart.'});
    }
});

router.get('/:userID', async(req, res) => {
    const {userID} = req.params;
    try {
        const CartItems = await CartItem.find({ accID: userID}).populate('fishID');
        res.status(201).json(CartItems);
    } catch (error) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:userID/item/:fishID', async (req, res) => {
    const {userID, fishID} = req.params;
    try {
        const deletedItem = await CartItem.findOneAndDelete({ accID: userID, fishID});
        if (deletedItem){
            res.status(201).json({message: "Item removed from cart successfully." });
        } else {
            res.status(400).json({ message: "Item now found !" });
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
});

module.exports = router;