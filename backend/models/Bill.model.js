const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                refPath: 'items.productType', 
                required: true
            },

            productType: {
                type: String,
                required: true,
                enum: ['Fish', 'Item'] 
            },

            quantity: {
                type: Number,
                required: true
            },

            price: {
                type: Number,
                required: true
            },
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    status:{
        type: String,
        enum: ['In Process','On Delevery', 'Done'] 
    }

});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill
