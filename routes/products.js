const productRouter = require('express-promise-router')();
const productsController = require('../controllers/products');
const passport = require('passport');
const passportJWT = passport.authenticate('jwt',{ session: false });

productRouter.route('/addproductmultipleimages')
.post(passportJWT, productsController.addProductMultipleImages);

productRouter.route('/addproductsingleimage')
.post(passportJWT, productsController.addProductSingleImage);

productRouter.route('/getproducts')
.get(productsController.getProducts);

productRouter.route("/deleteproduct")
.post(passportJWT, productsController.deleteProduct)


module.exports = productRouter;