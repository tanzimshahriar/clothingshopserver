const express = require('express');
const userRouter = require('express-promise-router')();
const UsersController = require('../controllers/users');
const passport = require('passport');
const passportConf = require('../passport');

const { validateBody, schemas } = require('../helpers/user-validation');
const passportLogin = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt',{ session: false });
const passportGoogle = passport.authenticate('googleToken', { session: false });
const passportFacebook = passport.authenticate('facebookToken', { session: false });

userRouter.route('/signup')
.post(validateBody(schemas.authSchema), UsersController.signup);

userRouter.route('/login')
.post(validateBody(schemas.authSchema), passportLogin, UsersController.login);

userRouter.route('/oauth/google')
.post(passportGoogle,UsersController.googleOAuth);

userRouter.route('/oauth/facebook')
.post(passportFacebook,UsersController.facebookOAuth);

userRouter.route('/checkuseradmin')
.post(passportJWT, UsersController.checkUserAdmin);

module.exports = userRouter;