const JWT = require('jsonwebtoken');
const User = require('../models/user');

signToken = user => {
    return token = JWT.sign({
        iss: 'clothingshop',
        sub: user._id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, process.env.TOKEN_SECRET);
}

module.exports = {
    signup: async (req, res, next) => {
        const {
            email,
            password
        } = req.body;

        //check if account already exists
        const founduser = await User.findOne({
            "local.email": email
        });
        if (founduser) {
            return res.status(403).json({
                error: "Account already exists"
            });
        }

        //hash password

        const newUser = new User({
            method: 'local',
            local: {
                email,
                password
            }
        })
        newUser.save(async function (err, ) {
            if (err) {
                return console.log(err);
            }
        });

        //generate token
        const token = signToken(newUser);

        //respond with token
        res.json({
            token,
            "email" : email
        });
    },
    login: async (req, res, next) => {
        const token = signToken(req.user);
        res.status(200).json({
            token,
            email: req.user.local.email,
            admin: req.user.local.admin
        });
    },
    googleOAuth: async (req, res, next) => {
        //generate token
        const token = signToken(req.user);
        res.status(200).json({
            token,
            email: req.user.google.email
        });
    },
    facebookOAuth: async (req, res, next) => {
        //generate token

        const token = signToken(req.user);
        res.status(200).json({
            token,
            email: req.user.facebook.email
        });
    },
    checkUserAdmin: async (req, res, next) => {
        const admin =  req.user.local.admin? true : false;
        res.json({
            result: admin
        });
    },
}