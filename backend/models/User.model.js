const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,  // Always store email in lowercase
    unique: true,  // Make sure email is unique
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'], // Add validation
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    default: 0,
  },
  address: {
    type: String,
    default: '',
  },
  avt: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    required: true,
    default: 'user',
  }
});

// Hash the password before saving
userSchema.pre('save', async function(next) {
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

const User = mongoose.model('User', userSchema);
module.exports = User;
