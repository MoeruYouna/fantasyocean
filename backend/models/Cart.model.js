const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    accID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    }
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
