const Comment=require('../models/comment')
const Post=require('../models/post')
const commentsMailer=require('../mailer/comments_mailer')
const commentEmailWorker=require('../workers/comment_email_worker')
const queue = require('../config/kue');
const Like=require('../models/like')
//comment on post 

module.exports.create=async function(req,res){
  //METHOD 1

//      Post.findById(req.body.post,function(err,post){
//         console.log(post);
//         if(err){console.log('cannot find the post to comment');return;}
//         if(post){
//             Comment.create({
// content:req.body.content,
// post:req.body.post,
// user:req.user._id
//             },function(err,comment){
//            if(err){console.log('error in commmenting on post'); return;} 
//        post.comments.push(comment);
//        post.save();
//            return res.redirect('/');   
//         })
//         }
//      })

//METHOD 2
try{
  let post=await Post.findById(req.body.post);
  if(post){
         let comment= await Comment.create({
    content:req.body.content,
    post:req.body.post,
    user:req.user._id
                })
                post.comments.push(comment);
         post.save();
         comment = await comment.populate({path:'user',select:'name email'})
        // commentsMailer.newComment(comment); -->old and not in used by me 
    post=await post.populate({path:'user',select:'name email'})
    
    // console.log('*************************',post)
        //creting a new job or pushing the job in already queue
        // let job=queue.create('emails',post).save(function(err) {
        //   if(err){
        //     console.log('error in sending to queue',err);
        //   return;
        // }
        //   // console.log('job enqueued',job.id);
        // })
      
         if(req.xhr){   
          return res.status(200).json({  
           data:{
            comment:comment
           },
           message:"comment added"
          })
         }
         req.flash('success','Comment Published')
             return res.redirect('/');   
  }
}
catch(err){
  console.log('Error',err);
  return;
}

}


//deleting a comment 
//METHOD 1

module.exports.destroy=async function(req,res){
  //   Comment.findById(req.params.id,function(err,comment){
  //  Post.findById(comment.post, function(err,post){
    
  //   if(err){console.log('cannot find by id');return;}
  //   postUser=post.user;
  //   if(comment.user==req.user.id||postUser==req.user.id){
       
  //     let postId= comment.post;
  //     Comment.remove();
  //     Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}},function(err,post){
  //       return res.redirect('back');

        
  //     })
  //   }
  //   else{
  //       return res.redirect('back');
  //   } 
  //  })
         
    // })
    //METHOD 2
    try{
      let comment=await Comment.findById(req.params.id);
      let post=await Post.findById(comment.post);
      if(comment.user==req.user.id||post.user==req.user.id){
        await Like.deleteMany({onModel:"Comment",likeable:comment._id});
      
        let postId= comment.post;
            comment.remove();
           await Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}});
           await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});
           if (req.xhr){
            return res.status(200).json({
                data: {
                    comment_id: req.params.id
                },
                message: "comment deleted"
            });
        }
req.flash('success','comment deleted!')
           return res.redirect('back');
           }
         else{
          req.flash('error', 'Unauthorized');
        return res.redirect('back');
    } 
    }
    catch(err){

    }

}
