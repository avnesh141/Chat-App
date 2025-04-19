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
    encryptedMessage: {
        type: String,
        required: ()=>{
            return this.messageType==="text";
        },
    },
    encryptedKeys:{
        sender:{
            type:String
        },
        receiver:{
            type:String
        }
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