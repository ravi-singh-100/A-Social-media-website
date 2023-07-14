const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost/codial_developement');
const db=mongoose.connection;
db.on('error',console.error.bind(console,'error connecting to db'))
db.once('open',function(){
    console.log('successfully connected to the datbase')
    
})
module.exports=db;