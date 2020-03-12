const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const Order = require('../models/order');

//create schema
const userSchema = new Schema({
    method: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        required: true
    },
    local: {
        email: {
            type: String,
            lowercase: true
        },
        password: {
            type: String,
        },
        admin: {
            type: Boolean
        }
    },
    google: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    },
    facebook: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    },
    orders: []
});

userSchema.pre('save', async function(next) {
    try{
        if(this.method !== 'local'){
            next();
        }

        //generate salt
        const salt = await bcrypt.genSalt(10);
        //generate hash
        const passwordHash = await bcrypt.hash(this.local.password, salt);
        //reassign password with hash
        this.local.password = passwordHash;
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.isValidPassword = async function(newPassword) {
    try {
        return await bcrypt.compare(newPassword, this.local.password)
    } catch (error) {
        throw new Error(error)
    }
}

//create model
const User = mongoose.model('user', userSchema)

//export model
module.exports = User;