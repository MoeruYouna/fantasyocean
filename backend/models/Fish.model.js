const mongoose = require('mongoose');

const FishSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
});

const Fish = mongoose.model('Fish', FishSchema);

module.exports = Fish;
