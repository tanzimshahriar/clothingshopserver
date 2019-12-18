const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const {
    ExtractJwt
} = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token')
const FacebookTokenStrategy = require('passport-facebook-token')
const User = require('./models/user');

//json web token strategy
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: process.env.TOKEN_SECRET
}, async (payload, done) => {
    try {
        //find user from token
        const user = await User.findById(payload.sub)

        //if user dont exist handle it
        if (!user) {
            return done(null, false);
        }

        //send back user
        done(null, user);

    } catch (error) {
        done(error, false);
    }
}));

// google oauth strategy
passport.use('googleToken', new GooglePlusTokenStrategy({
    clientID: process.env.OAUTH_GOOGLE_CLIENT_ID,
    clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await User.findOne({
            "google.id": profile.id
        });
        if (existingUser) {
            return done(null, existingUser);
        }

        const newUser = new User({
            method: "google",
            google: {
                id: profile.id,
                email: profile.emails[0].value
            }
        })
        await newUser.save();
        done(null, newUser);

    } catch (error) {
        done(error, false, error.message)
    }

}))

//facebook strategy

passport.use('facebookToken', new FacebookTokenStrategy({
    clientID: process.env.OAUTH_FACEBOOK_CLIENT_ID,
    clientSecret: process.env.OAUTH_FACEBOOK_CLIENT_SECRET
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await User.findOne({
            "facebook.id": profile.id
        });
        if (existingUser) {
            return done(null, existingUser);
        }

        const newUser = new User({
            method: "facebook",
            facebook: {
                id: profile.id,
                email: profile.emails[0].value
            }
        })
        await newUser.save();
        done(null, newUser);

    } catch (error) {
        done(error, false, error.message);
    }
}));


//local strategy

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        //find user
        const user = await User.findOne({
            "local.email": email
        });

        if (!user) {
            return done(null, false);
        }

        //check password from model
        const isMatch = await user.isValidPassword(password);

        //if password do not match, handle it
        if (!isMatch) {
            return done(null, false);
        }

        done(null, user);

    } catch (error) {
        done(error, false);
    }


}));