const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    chatId: {
        type: String,
        required: true
    },
    messageType:{
          type:String,
          enum:["text","file"],
          required:true
    },
    message: {
        type: String,
        required: ()=>{
            return this.messageType==="text";
        },
    },
    fileUrl:{
        type:String,
        required:()=>{
            return this.messageType==="file";
        }
    }
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;