const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    fishID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fish',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
});

const CartItem = mongoose.model('Cart', CartSchema);

module.exports = CartItem;
