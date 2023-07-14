const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

//tell passport new strategy to use google login
passport.use(new googleStrategy({
    clientID: "865809621570-krmj9aue19ndml3jjijjheles1u03gu8.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/users/auth/google/callback"
},
function(accessToken,refreshToken,profile,done){
    console.log('google')
//find a user if 
    User.findOne({email:profile.emails[0].value}).exec(function(error,user){
        if(error){console.log('error int google strategy passport',error);return;}
        console.log(profile);
        // if found set this user as req.user
        if(user){
        
            return done(null,user);
        }else{
            //if not found,create the user ans set it as req.user
            User.create({
                name:profile.displayName,
                email:profile.emails[0].value,
                password:crypto.randomBytes(20).toString('hex')
            },function(err,user){
                if(err){console.log('error in creating user',err);return;}
                return done(null,user);
            })
        }
    })
}
))
module.exports=passport;