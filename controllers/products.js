const Product = require('../models/product');
var upload = require('../helpers/imageUpload');

module.exports = {
    addProduct: async (req, res, next) => {
        req.user.local.admin ? null : res.status(401).send('Unauthorized');
        upload(req,res,function(err) {
            if(err){
                return res.status(400).json(err);
            }
            const file = req.file;
            
            var b = []
            console.log(req.image)
            b.push(file);
            const newProduct = new Product({
                name: req.body.name,
                price: req.body.price,
                sale: req.body.sale,
                description: req.body.description,
                quantity: {},
                images: b
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