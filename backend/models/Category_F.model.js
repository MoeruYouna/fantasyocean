const mongoose = require('mongoose');

const CatFSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
});

const CatF = mongoose.model('Category F', CatFSchema);

module.exports = CatF;
