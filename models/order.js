const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const orderSchema = new Schema({
    userid: {
        type: String
    },
    items: {
        type: Array,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    shippingPrice: {
        type: Number,
        required: true
    },
    time: {
        type: Date,
        default: 0
    },
    address: {
        type: String,
    }
});

//create model
const Order = mongoose.model('order', orderSchema)

//export model
module.exports = Order;