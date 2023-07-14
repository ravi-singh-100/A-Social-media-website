const mongoose=require('mongoose')
const likeSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
//this defines the object id of the liked object
    likeable:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        refPath:'onModel' //what is liked post or the comment
    },
    //this field is used to define the type of the liked object since this is a dhynamic reference

   onModel:{
type:String,
require:true,
enum:['Post','Comment']  //models which conatins the like
   }
},{
    timestamps:true
   
})
const Like=mongoose.model('Like',likeSchema)
module.exports=Like;