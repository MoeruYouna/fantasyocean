const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    catID: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category I', 
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
    },

    quantity: {
        type: Number,
        required: true,
    }
});

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;
