const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const productSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    sale: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: true
    },
    quantity: [],    
    images: [],
    orders: {
        type: Number,
        default: 0
    }
});

//create model
const Product = mongoose.model('product', productSchema)

//export model
module.exports = Product;