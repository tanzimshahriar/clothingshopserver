const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const sizeSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

//create model
const size = mongoose.model('size', sizeSchema)

//export model
module.exports = size;