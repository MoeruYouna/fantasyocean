const mongoose = require('mongoose');

const CatISchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
});

const CatI = mongoose.model('Category I', CatISchema);

module.exports = CatI;
