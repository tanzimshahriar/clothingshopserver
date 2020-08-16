const productRouter = require('express-promise-router')();
const productsController = require('../controllers/products');
const passport = require('passport');
const passportJWT = passport.authenticate('jwt',{ session: false });

productRouter.route('/addproduct')
.post(passportJWT, productsController.addProduct);

productRouter.route('/getproducts')
.get(productsController.getProducts);

productRouter.route("/deleteproduct")
.post(passportJWT, productsController.deleteProduct)

productRouter.route("/getsizes")
.get(passportJWT, productsController.getSizes)

productRouter.route("/getcategories")
.get(passportJWT, productsController.getCategories)


module.exports = productRouter;