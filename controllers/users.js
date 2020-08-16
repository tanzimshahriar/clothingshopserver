const JWT = require('jsonwebtoken');
const User = require('../models/user');
const Order = require('../models/order');
const Product = require('../models/product/product');

signToken = user => {
    return token = JWT.sign({
        iss: 'clothingshop',
        sub: user._id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, process.env.TOKEN_SECRET);
}

module.exports = {
    signup: async (req, res, next) => {
        const {
            email,
            password
        } = req.body;

        //check if account already exists
        const founduser = await User.findOne({
            "local.email": email
        });
        if (founduser) {
            return res.status(403).json({
                error: "Account already exists"
            });
        }

        //hash password

        const newUser = new User({
            method: 'local',
            local: {
                email,
                password
            }
        })
        newUser.save(async function (err, ) {
            if (err) {
                return console.log(err);
            }
        });

        //generate token
        const token = signToken(newUser);

        //respond with token
        res.json({
            token,
            "email": email
        });
    },
    login: async (req, res, next) => {
        const token = signToken(req.user);
        res.status(200).json({
            token,
            email: req.user.local.email,
            admin: req.user.local.admin
        });
    },
    googleOAuth: async (req, res, next) => {
        //generate token
        const token = signToken(req.user);
        res.status(200).json({
            token,
            email: req.user.google.email
        });
    },
    facebookOAuth: async (req, res, next) => {
        //generate token

        const token = signToken(req.user);
        res.status(200).json({
            token,
            email: req.user.facebook.email
        });
    },
    checkUserAdmin: async (req, res, next) => {
        const admin = req.user.local.admin ? true : false;
        res.json({
            result: admin
        });
    },
    order: async (req, res, next) => {
        const {
            items,
            subtotal,
            shipping
        } = req.body;
        for (var i = 0; i < items.length; i++) {
            var product = await Product.findOne({
                "code": items[i]._id
            });
            if (!product && !product.name) {
                //send an error message to client that product isnt available or quantity is too many
                return res.status(404).json({
                    msg: "Item in cart not found",
                    result: "failed"
                })
            }
        };

        var newOrder = new Order({
            items,
            subtotal,
            shippingPrice: shipping,
            time: new Date().getTime()
        })
        newOrder.save(function (err) {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    msg: "Order Saving failed",
                    result: "failed",
                    err
                })
            } else {
                return res.status(200).json({
                    msg: "You order has been placed successfully",
                    result: "success"
                })
            }
        });
    },
    orderLoggedIn: async (req, res, next) => {
        const {
            items,
            subtotal,
            shipping
        } = req.body;
        for (var i = 0; i < items.length; i++) {
            var product = await Product.findOne({
                "code": items[i]._id
            });
            if (!product && !product.name) {
                //send an error message to client that product isnt available or quantity is too many
                return res.status(404).json({
                    msg: "Item in cart not found",
                    result: "failed"
                })
            }
        };

        var newOrder = new Order({
            userid: req.user._id,
            items,
            subtotal,
            shippingPrice: shipping,
            time: new Date().getTime()
        })

        await newOrder.save(function (err) {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    msg: "Order Saving failed",
                    result: "failed",
                    err
                })
            }
        });

        var orders = req.user.orders && (req.user.orders).length && (req.user.orders).length>0? req.user.orders.concat([newOrder._id]) : [newOrder._id];
        await User.findByIdAndUpdate(req.user._id, {orders}, function(err){
            if(err){
                return res.status(400).json({
                    msg: "Order Saving failed for user",
                    result: "failed",
                    err
                })
            } else {
                return res.status(200).json({
                    msg: "You order has been placed successfully",
                    result: "success"
                })
            }
        })
    },
    getOrders: async (req,res, next) => {
        var allorders = [];
        var orders = await User.findById(req.user._id, function(error){
            if(error){
                return res.status(500).json(error);
            }
        })
        .select("orders")
        for(var i = 0; i < orders.orders.length; i++){
            var order = await Order.findById(orders.orders[i], function(err){
                if(err){
                    console.log(err);
                    return res.status(500).json(err);
                }
            });
            allorders.push(order);
        }
        res.status(200).json(allorders);
    }
}