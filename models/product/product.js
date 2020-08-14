const mongoose = require('mongoose');
const { Binary } = require('mongodb');
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
    sizeAndQuantityAvailable: [{ size: { type: String }, quantityAvailable: { type: Number }}],
    //quantity removed, images[] changed orders changed from object to array   
    images: [{ src: { type: String }, color: { type: String} }],
    gender: {
        male: { type: Boolean },
        female: { type: Boolean }
    },
    orders: [],
    categories: []
});

//create model
const Product = mongoose.model('product', productSchema)

//export model
module.exports = Product;