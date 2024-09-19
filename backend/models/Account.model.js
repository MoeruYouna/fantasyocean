const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AccSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,  // Always store email in lowercase
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'], // Add validation
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
});

// Hash the password before saving and normalize the email to lowercase
AccSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
      return next(err);
    }
  }
  this.email = this.email.toLowerCase();  // Normalize email to lowercase
  next();
});

const Acc = mongoose.model('Acc', AccSchema);
module.exports = Acc;
