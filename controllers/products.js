const Product = require('../models/product/product');
var upload = require('../helpers/imageUpload');
var deleter = require('../helpers/deleteUploads');
const fs = require('fs');

module.exports = {
    addProduct: async (req, res, next) => {
        req.user.local.admin ? null : res.status(401).send('Unauthorized');
        upload.array('images')(req, res, async function (err) {
            if (err) {
                return res.status(400).json(err);
            }
            if (req.body.isNewProduct == "true") {
                const files = req.files;
                var images = [];
                //convert files to images
                for (var i = 0; i < files.length; i++) {
                    var img = fs.readFileSync(files[i].path);
                    //new JSON object for the image
                    var finalImg = {
                        contentType: files[i].mimetype,
                        path: files[i].path,
                        image: Buffer.from(img, 'binary').toString('base64')
                    };
                    images.push(finalImg);
                }

                const newProduct = new Product({
                    code: req.body.code,
                    name: req.body.name,
                    price: req.body.price,
                    sale: req.body.sale,
                    description: req.body.description,
                    quantity: {},
                    images: images
                })

                newProduct.save()
                    .then(function () {
                        deleter.deleteAllUploads();
                        res.status(200).json({
                            result: "success"
                        })
                    })
                    .catch(function (err) {
                        res.status(400).json({
                            err
                        })
                    });
            } else {

                var product = await Product.findOne({
                    "code": req.body.code
                });
                const files = req.files;
                var newImages = [];

                //find new and old images
                for (var i = 0; i < files.length; i++) {
                    if (!files[i].image) {
                        newImages.push(files[i]);
                    }
                }

                //set everything except images
                product.name = req.body.name;
                product.price = req.body.price;
                product.sale = req.body.sale;
                product.description = req.body.description;
                product.quantity = req.body.quantity;


                var images = [];
                //convert files to images
                for (var i = 0; i < newImages.length; i++) {
                    var img = fs.readFileSync(files[i].path);
                    //new JSON object for the image
                    var finalImg = {
                        contentType: newImages[i].mimetype,
                        path: newImages[i].path,
                        image: Buffer.from(img, 'binary').toString('base64')
                    };
                    images.push(finalImg);
                }

                //delete old images that were deleted
                var oldImages = product.images;
                var indexes = [];
                if (req.body.deletedOldImages) {
                    //find the indexes of oldImages to delete
                    for (var i = 0; i < req.body.deletedOldImages.length; i++) {
                        for (var j = 0; j < oldImages.length; j++) {
                            if (oldImages[j].path == req.body.deletedOldImages[i]) {
                                indexes.push(j);
                            }
                        }
                    }
                    //delete the images according to the indexes
                    for (var i = 0; i < indexes.length; i++) {
                        console.log(indexes[i])
                        oldImages.splice((indexes[i] - i), 1);
                    }
                } else if (req.body.deletedOldImage) {
                    var index = -1;
                    for (var j = 0; j < oldImages.length; j++) {
                        if (oldImages[j].path == req.body.deletedOldImage) {
                            index = j;
                        }
                    }
                    oldImages.splice((index), 1);
                }

                //add new images to old images
                var finalImages = oldImages.concat(images);
                product.images = finalImages;

                product.save()
                    .then(function () {
                        res.status(200).json({
                            result: "success"
                        })
                        deleter.deleteAllUploads();
                    })
                    .catch(function (err) {
                        res.status(200).json(err)
                    })


            }
        });
    },

    //returns all products by default
    //parameters accepted are id only to return specific product
    //price, sale, categories[], max, sort etc to get an array of items
    getProducts: async (req, res, next) => {
        if (req.query.id && req.query.id != '') {
            const product = await Product.findById(req.query.id);
            if (product) {
                return res.status(200).json({
                    product
                });
            } else {
                return res.status(400).json("item doesn't exist")
            }
        } else {
            const products = await Product.find();
            if (products) {
                return res.status(200).json({
                    products
                });
            } else {
                return res.status(400)
            }
        }
    },

    deleteProduct: async (req, res, next) => {
        //check if the user is admin
        const admin = req.user.local.admin ? true : false;
        !admin ? res.status(403).json("unauthorized") : null;

        try {
            //find product and delete
            await Product.findOneAndDelete({
                "code": req.body.code
            });
            res.status(200).json({
                result: "success"
            })


        } catch (error) {
            console.log(error)
            res.status(400).json({
                error
            });
        }
    }
}