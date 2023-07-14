const express = require('express');
const router = express.Router();
const passport=require('passport');

const usersController = require('../controllers/users_controller');

router.get('/profile/:id',passport.checkAuthentication, usersController.profile); //if autheticated then only we can go to the sign in page
router.post('/update/:id',passport.checkAuthentication,usersController.update);
router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);

router.get('/forget-password',usersController.forgetPassword)   //forget password
router.post('/sending-forget-emails',usersController.sendingForgetEmail);
// router.get('/reset-password/:token',passport.authenticate('jwt',{session:false}),usersController.reset_password);

router.get('/sign-out',usersController.destroySession)
router.post('/create', usersController.create);
//use passport as a middleware to authenticate
router.post('/create-session',passport.authenticate(
'local',
{failureRedirect:'/users/sign-in'}
),usersController.createSession)

router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']})) //fetching the data from the google database

router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/sign-in'}),usersController.createSession) //this is where i will get the data from the google database after fetching
module.exports = router;