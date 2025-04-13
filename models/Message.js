const mongoose =require('mongoose');
const { required } = require('nodemon/lib/config');

const messageSchema= new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    chatId:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true,
    }
},{timestamps:true});

const Message=mongoose.model("Message",messageSchema);

module.exports=Message;