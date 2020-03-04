const Product = require('../models/product');
var upload = require('../helpers/imageUpload');
const fs = require('fs');

module.exports = {
    addProductMultipleImages: async (req, res, next) => {
        req.user.local.admin ? null : res.status(401).send('Unauthorized');
        upload.array('images')(req,res,function(err) {
            if(err){
                return res.status(400).json(err);
            }
            const files = req.files;
            var images = [];
            //convert files to images
            for(var i = 0; i < files.length; i++) {
                var img = fs.readFileSync(files[i].path);
                var encode_img = img.toString('base64');
                //new JSON object for the image
                var finalImg = {
                    contentType: files[i].mimetype,
                    path: files[i].path,
                    image: new Buffer(encode_img, 'base64')
                };
                images.push(finalImg);
            }

            const newProduct = new Product({
                name: req.body.name,
                price: req.body.price,
                sale: req.body.sale,
                description: req.body.description,
                quantity: {},
                images: images
            })

            newProduct.save(async function (err, ) {
                if (err) {
                    res.status(400).json({
                        err
                    })
                }
                else {
                    res.status(200).json({
                        result: "success"
                    })
                }
            });
        });
    },
    addProductSingleImage: async (req, res, next) => {
        req.user.local.admin ? null : res.status(401).send('Unauthorized');
        upload.single('images')(req,res,function(err) {
            if(err){
                return res.status(400).json(err);
            }
            var imagesArray = [];
            imagesArray.push(req.file);
            const newProduct = new Product({
                name: req.body.name,
                price: req.body.price,
                sale: req.body.sale,
                description: req.body.description,
                quantity: {},
                images: imagesArray
            })

            newProduct.save(async function (err, ) {
                if (err) {
                    res.status(400).json({
                        err
                    })
                }
                else {
                    res.status(200).json({
                        result: "success"
                    })
                }
            });
        });
    },
    getProducts: async (req, res, next) => {
        const products = await Product.find();
        if (products) {
            return res.status(200).json({
                products
            });
        }
    },
    deleteProduct: async (req, res, next) => {
        //check if the user is admin
        const admin = req.user.local.admin ? true : false;
        !admin ? res.status(403).json("unauthorized") : null;
        console.log(req.body)
        try {
            //find product and delete
            await Product.findOneAndDelete({
                "name": req.body.name,
                "price": req.body.price,
                "description": req.body.description
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