const User = require('../models/user');
const fs=require('fs');
const path=require('path')
const forgetPasswordEmailWorker=require('../workers/forget_password_email_worker')
const forgetPasswordMailer=require('../mailer/forget_password_mailer')
const queue=require('../config/kue');
// const jwt=require('jsonwebtoken');
//profile page
module.exports.profile = function(req, res){
    User.findById(req.params.id,function(err,user){
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user:user
        })
    })
 
}
//forget password page
module.exports.forgetPassword=(req,res)=>{
    return res.render('forget_password',{
        title: 'Forget-password',
    })
    }

    //sending forget emails
    module.exports.sendingForgetEmail=(req,res)=>{
    
        User.findOne({email: req.body.email},function(err,user){
        
            if(err){console.log('error in sending forget password mail');return;}
                //mailing takes place here
            if(user){
                // req.body.token=jwt.sign(user.toJSON(),'gotohell',{expiresIn:'100000'});
      // ********* kue worker forget password email **********
      let job=queue.create('forget-password-emails',req.body).save(function(err){

        if(err){
          console.log('error in sending to (kue worker)queue',err);
        return;
      }  

  })
  return res.redirect('back');
            }
        
            else{
                return res.redirect('sign-up');
            }
        })
        }

        //sending to set_new_password_page
        // module.exports.reset_password=function(req,res){
        //     console.log(req.body);
        //     return res.render('set_new_password',{
        //         title: 'Reset-password',
        //     })
        // }



//update profile details
module.exports.update=async function(req,res){
    //METHOD 1

//     if(req.params.id==req.user.id){
// User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
//    req.flash('success','Updated')
//     return res.redirect('back');
   
// });
//     }
//     else{
//         req.flash('error','Unauthorized');
//         return res.status(401).send('Unauthorized');
//     }

//METHOD 2
if(req.params.id==req.user.id){
    try{
let user=await User.findById(req.params.id);
User.uploadedAvatar(req,res,function(err){
    if(err){console.log('Multer error ',err); return res.redirect('back')   }
// console.log(req.file);
user.name=req.body.name;
user.email=req.body.email;
if(req.file){
    if(user.avatar&&fs.existsSync(path.join(__dirname,'..',user.avatar))){
fs.unlinkSync(path.join(__dirname,'..',user.avatar));

// console.log(path.join(__dirname,'..',user.avatar))
    }
    //saving the path of the uploaded fiole in the avatar field in the user

user.avatar=User.avatarPath+'/'+req.file.filename;
}
user.save();
return res.redirect('back');
})
    }
    catch(error){
        req.flash('error',err);
        return res.redirect('back');
    }
}
else{
           req.flash('error','Unauthorized');
        return res.status(401).send('Unauthorized'); 
}
}

// render the sign up page
module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// get the sign up data
module.exports.create = function(req, res){
    if (req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up'); return}

        if (!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in creating user while signing up'); return}

                // return res.redirect('/users/sign-in');
                req.flash('success','Successfully sign-up');
                return res.redirect('/users/sign-in');
            })
        }else{
            return res.redirect('back');
        }

    });
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success','Logged in succssfully');
//    return res.redirect('/users/profile');
return res.redirect('/');
}
module.exports.destroySession=function(req,res){

    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success','You have logged out!');
       return res.redirect('/');
      });
    // req.logout();
    // return res.redirect('/');
}