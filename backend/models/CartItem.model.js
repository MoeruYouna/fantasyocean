const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    accID: {
        type: mongoose.Schema.Types.ObjectId, // Sử dụng ObjectId để tham chiếu giỏ hàng
        ref: 'Cart',
        required: true
    },
    fishID: {
        type: mongoose.Schema.Types.ObjectId, // Sử dụng Number để tham chiếu id từ bảng Fish
        ref: 'Fish',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    }
});

const CartItem = mongoose.model('CartItem', CartItemSchema);

module.exports = CartItem;
