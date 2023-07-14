const mongoose = require('mongoose');
const multer=require('multer');
const { dirname } = require('path');
const path=require('path')
const AVATAR_PATH=path.join('/uploads/users/avatars')  //path where we will store the image 
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
 
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar:{
  type:String,

    }
}, {
    timestamps: true
});
//define the storage
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname ,'..',AVATAR_PATH)); 
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  });

//static methods
userSchema.statics.uploadedAvatar=multer({storage:storage}).single('avatar')
userSchema.statics.avatarPath=AVATAR_PATH;
const User = mongoose.model('User', userSchema);

module.exports = User;