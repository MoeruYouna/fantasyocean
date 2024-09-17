const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
