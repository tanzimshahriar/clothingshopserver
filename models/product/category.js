const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    parents: [],
    children: []
});

//create model
const Category = mongoose.model('category', categorySchema)

//export model
module.exports = Category;