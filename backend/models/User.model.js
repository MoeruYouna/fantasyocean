// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  accID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Acc',
    required: true,
  },
  cartID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
    required: false,
  },
  age: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    unique: false,
  },
  avt: {
    type: String,
    unique: false,
  },
  description: {
    type: String,
    unique: false,
    required: false,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
