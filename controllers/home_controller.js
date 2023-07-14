const { populate } = require('../models/comment')
const Post=require('../models/post')
const User=require('../models/user')
module.exports.home = async function(req, res){
    // console.log(req.cookies);
    // res.cookie('user_id', 25);
//    Post.find({},function(err,posts){
//     return res.render('home',{ 
//         title:"codial | Home",
//         posts:posts
//     })
//    })


   //populate the user of each post-> to fetch the complete user

//METHOD 1

//    Post.find({})
//    .populate('user')
//    .populate({
//     path:'comments',
//     populate:{
//         path:'user'
//     }
//    })
//    .exec(function(err,posts){

// User.find({},function(err,users){
//     return res.render('home',{
//         title:"Codial | Home",
//         posts:posts,
//         all_users:users
//     })
// })

    // if(err){console.log('error in finding the post');return;}
  
//    })


// METHOD 2
try{
    let posts=await Post.find({})
    .sort('-createdAt') //to sort
    .populate('user')
    .populate({
        path:'comments',
        populate:{
            path:'user likes'
        }
    }).populate('likes')
    
    let users=await User.find({})
    
    return res.render('home',{
        title:"Codial | Home",
        posts:posts,
        all_users:users
    })
}
catch(err){
console.log("Error ",err);
return;
}


    // return res.render('home', {
    //     title: "Home"
    // });
}

// module.exports.actionName = function(req, res){}


// using then
// Post.find({}).populate('comments').then(function(){})

// let posts=Post.find({}).populate('comments').exec();
// posts.then()