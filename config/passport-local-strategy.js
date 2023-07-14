 const passport=require('passport');
const User = require('../models/user');
const LocalStrategy=require('passport-local').Strategy; //WE TELL THE LOCALSTRATEGY TO USE THIS STRATEGY THAT WE HAVE CREATED
//authentication using passport 
passport.use(new LocalStrategy({
    usernameField:'email', //recognise a user and always be unique
passReqToCallback:true
},
function(req,email,password,done){  //done is callback 
//find the user and establish the identity
User.findOne({email:email},
    function(error,user){
if(error){
    req.flash('error',error);
 return done(error);
}
if(!user||user.password!=password){
    req.flash('error','Invalid username/password');
    return done(null,false);  //false bcz authentication is not right or done

}
return done(null,user); 
    })      //find using the email and value email is passed

}
))
//seriallising the user to decide which key is to be kept in the cookies
passport.serializeUser((user,done)=>{
    return done(null,user.id);
})
//deserialsing the user from the key in the cookie

passport.deserializeUser((id,done)=>{
    User.findById(id,function(error,user){
        if(error){
            console.log("error in finding the uder")
            return done(error);
        }
        return done(null,user);
        })
})
//check is the user is authenticated
passport.checkAuthentication=function(req,res,next){
    // if the user is signed in ,then pass on the request to next function(controllers action)
if(req.isAuthenticated()){
    return next();
}
// if user is not signed in 
return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser=function(req,res,next){
   if(req.isAuthenticated()){
    //req.user contains the current sign in user from the session cookie ans we are just sending this local for the views
    res.locals.user=req.user;
   } 
   next(); 
}
module.exports=passport;