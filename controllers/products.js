const Product = require('../models/product');
const imageUpload = require('../helpers/imageUpload');

module.exports = {
    addProduct: async (req, res, next) => {
        req.user.local.admin ? null : res.status(401).send('Unauthorized');
        const {
            name,
            price,
            sale,
            description,
            quantity,
            images
        } = req.body;
        const newProduct = new Product({
            name,
            price,
            sale,
            description,
            quantity,
            images
        })
        newProduct.save(async function (err, ) {
            if (err) {
                return console.log(err);
            }
        });
        console.log(req);
        res.status(200).json({
            result: "success"
        })

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
        const admin =  req.user.local.admin? true : false;
        !admin? res.status(403).json("unauthorized") : null;
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