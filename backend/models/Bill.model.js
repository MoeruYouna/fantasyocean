const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true },
    items: [
        {
            fishId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Fish', 
                required: true 
            },

            quantity: { 
                type: Number, 
                required: true
            },

            price: { 
                type: Number, 
                required: true 
            }
        }
    ],
    totalPrice: { 
        type: Number, 
        required: true 
    },
    purchaseDate: { 
        type: Date, 
        default: Date.now
    }
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill
