const Product = require('../models/product');

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
    }
}