const Product = require('../models/product');

module.exports = {
    addProduct: async (req,res, next) => {
        req.user.local.admin? null : res.status(401).send('Unauthorized');
        res.json({
            secret: "secret"
        })
    }
}