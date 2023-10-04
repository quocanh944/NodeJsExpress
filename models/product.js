const Mongoose = require('mongoose');

const ProductSchema = new Mongoose.Schema({
    name: {
        type: String,
    }
});

module.exports = Mongoose.model('Product', ProductSchema);