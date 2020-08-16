const Product = require('../models/product/product');
const Size = require('../models/product/size');
const Category = require('../models/product/category');
var upload = require('../helpers/imageUpload');
var deleter = require('../helpers/deleteUploads');
const fs = require('fs');

module.exports = {
    addProduct: async (req, res, next) => {
        //check if the user is admin, if not return unauthorized
        const admin = req.user && req.user.local && req.user.local.admin ? true : false;
        if (!admin) {
            return res.status(401).json("Unauthorized");
        }
        await upload.array("images")(req, res, async function (err) {
            if (err) {
                console.log(err);
                return res.status(400).json(err);
            }
            try {
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

                    //set everything except images
                    var categories = JSON.parse(req.body.categories);
                    var code = req.body.code;
                    var description = req.body.description;
                    var gender = JSON.parse(req.body.gender);
                    var name = req.body.name;
                    var price = req.body.price;
                    var sale = req.body.sale;
                    var sizeAndQuantityAvailable = JSON.parse(req.body.sizeAndQuantityAvailable);


                    const newProduct = new Product({
                        categories,
                        code,
                        description,
                        gender,
                        name,
                        price,
                        sale,
                        sizeAndQuantityAvailable,
                        images
                    })
                    await newProduct.save((err) => {
                        deleter.deleteAllUploads();
                        if (err) {
                            console.log(err);
                            res.status(400).json(err);
                        }
                        res.status(200).json({
                            result: "success"
                        })
                    });
                } else {
                    var product = await Product.findById(req.body._id);
                    const files = req.files;
                    var newImages = [];

                    //find new and old images
                    for (var i = 0; i < files.length; i++) {
                        if (!files[i].image) {
                            newImages.push(files[i]);
                        }
                    }

                    //set everything except images
                    product.categories = JSON.parse(req.body.categories);
                    product.code = req.body.code;
                    product.description = req.body.description;
                    product.gender = JSON.parse(req.body.gender);
                    product.name = req.body.name;
                    product.price = req.body.price;
                    product.sale = req.body.sale;
                    product.sizeAndQuantityAvailable = JSON.parse(req.body.sizeAndQuantityAvailable);

                    //now convert newImages files to images
                    var images = [];
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

                    //add new images and old images
                    var finalImages = images && images.length && images.length > 0 ? oldImages.concat(images) : oldImages;
                    product.images = finalImages;

                    await product.save((err) => {
                        deleter.deleteAllUploads();
                        if (err) {
                            console.log(err);
                            res.status(400).json(err);
                        }
                    });
                    res.status(200).json({
                        result: "success"
                    })
                }
            } catch (error) {
                console.log(error);
                res.status(500).json(error);
            }
        });
    },

    //returns all products by default
    //parameters accepted are id only to return specific product
    //pricegt, pricelt, onsale, categories[], max, page, sort etc to get an array of items
    getProducts: async (req, res, next) => {
        const page = req.query.page;
        const max = req.query.max ? req.query.max : 20;

        //find the number of products so that noOfPages can be returned
        const count = await Product.collection.countDocuments();
        var noOfPages = Math.ceil(count / max);

        //set the query dynamically
        var searchQuery = {};
        var sort = {}

        //sale added to query
        req.query.onsale && req.query.onsale == "true" ? searchQuery["sale"] = { $gt: 0 } : null;

        //price added to query
        var pricegt = req.query.pricegt && !isNaN(req.query.pricegt) ? parseInt(req.query.pricegt) : null;
        var pricelt = req.query.pricelt && !isNaN(req.query.pricelt) ? parseInt(req.query.pricelt) : null;
        pricelt && pricegt ? searchQuery["price"] = { $gt: pricegt, $lt: pricelt } : null;

        //gender added to query
        var male = req.query.male && req.query.male=="true"? true : false;
        var female = req.query.female && req.query.female=="true"? true : false;
        male && female ? (searchQuery["gender"] = { male: true, female: true }) : male ? (searchQuery["gender"] = { male: true, female: false }) : female ? (searchQuery["gender"] = { male: false, female: true }) : null;

        //categories added to query
        console.log(req.query.categories)
        var categories = req.query.categories? JSON.parse(req.query.categories) : null;
        categories && categories.length > 0 ? searchQuery["categories"] = categories : null;

        //sizes add to query
        var sizes = req.query.sizes? JSON.parse(req.query.sizes) : [];
        sizes && sizes.length > 0 ? searchQuery["sizeAndQuantityAvailable"] = [{ size: sizes }] : null

        //sorting added
        if(req.query.sort){
            if(req.query.sort == "priceasc"){
                sort["price"] = 1;
            } else if (req.query.sort == "pricedesc"){
                sort["price"] = -1;
            } else if (req.query.sort == "nameasc"){
                sort["name"] = 1;
            } else if(req.query.sort == "namedesc"){
                sort["name"] = -1;
            }
        }

        console.log(searchQuery);

        //if query _id is sent to find a specific item
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
            //when no specific item by _id is requested by client
            //if its first page send only first max results
            if (!page || page == 0 || page == 1) {
                //search products with limit max

                // models.Post
                // .find({published: true})
                // .sort({'date': -1})
                // .limit(20)
                // .exec(function(err, posts) {
                //     // `posts` will be of length 20
                // });

                const products = await Product.find(searchQuery).limit(10).sort(sort);
                if (products) {
                    return res.status(200).json({
                        products, noOfPages
                    });
                } else {
                    return res.status(400)
                }

            } else {
                //if its not first page then skip required no of items
                var skip = (page - 1) * max

                const products = await Product.find(
                   searchQuery
                ).skip(skip).limit(10).sort(sort);
                if (products) {
                    return res.status(200).json({
                        products, noOfPages
                    });
                } else {
                    return res.status(400)
                }


            }
        }
    },

    deleteProduct: async (req, res, next) => {
        //check if the user is admin, if not return unauthorized
        const admin = req.user && req.user.local && req.user.local.admin ? true : false;
        if (!admin) {
            return res.status(401).json("unauthorized");
        }

        try {
            //find product and delete
            await Product.findOneAndDelete({
                "_id": req.body.id
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
    },
    getSizes: async (req, res, next) => {
        //check if the user is admin, if not return unauthorized
        const admin = req.user && req.user.local && req.user.local.admin ? true : false;
        if (!admin) {
            return res.status(401).json("unauthorized");
        }
        if (req.query.id && req.query.id != '') {
            const size = await Size.findById(req.query.id);
            if (size) {
                return res.status(200).json({
                    size
                });
            } else {
                return res.status(400).json("size doesn't exist")
            }
        } else {
            const sizes = await Size.find();
            if (sizes) {
                return res.status(200).json({
                    sizes
                });
            } else {
                return res.status(400)
            }
        }
    },
    getCategories: async (req, res, next) => {
        //check if the user is admin, if not return unauthorized
        const admin = req.user && req.user.local && req.user.local.admin ? true : false;
        if (!admin) {
            return res.status(401).json("unauthorized");
        }
        if (req.query.id && req.query.id != '') {
            const category = await Category.findById(req.query.id);
            if (category) {
                return res.status(200).json({
                    category
                });
            } else {
                return res.status(400).json("category doesn't exist")
            }
        } else {
            const categories = await Category.find();
            if (categories) {
                return res.status(200).json({
                    categories
                });
            } else {
                return res.status(400)
            }
        }
    }
}