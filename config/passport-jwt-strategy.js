const passport=require('passport');
const JWTStrategy=require('passport-jwt').Strategy;
const ExtractJWT=require('passport-jwt').ExtractJwt;
const User=require('../models/user');
let opts={
    jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken(),
    // secretOrKey : 'codeial',
    secretOrKey:'gotohell'
}
passport.use(new JWTStrategy(opts, function(jwtPayLoad, done) {
User.findById(jwtPayLoad._id,function(error,user){
if(error){console.log('error int finding the user from the jwt');return;}
if(user){
return done(null,user);
}
else{
    return done(null,false);
}
})
}))
module.exports=passport;