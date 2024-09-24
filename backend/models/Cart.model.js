// cartModel.js
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'items.productType', // Dynamic reference based on productType
  },
  productType: {
    type: String,
    required: true,
    enum: ['Fish', 'Item'], // Assuming these are your product types
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema],
  totalPrice: { type: Number, required: true },
});

module.exports = mongoose.model('Cart', cartSchema);
