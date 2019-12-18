const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: mongoose.Types.Decimal128,
        required: true
    },
    sale: {
        type: mongoose.Types.Decimal128,
    },
    description: {
        type: String,
        required: true
    },
    quantity: [],    
    images: []
});

//create model
const Product = mongoose.model('product', userSchema)

//export model
module.exports = Product;