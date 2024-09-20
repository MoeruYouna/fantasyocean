const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true },

  items: [
    {
      fishId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Fish', 
        required: true },

      quantity: { 
        type: Number, 
        required: true },

      price: { 
        type: Number, 
        required: true
    }, 
    }
  ],

  totalPrice: { 
    type: Number, 
    required: true, 
    default: 0 }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
