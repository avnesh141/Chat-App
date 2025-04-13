const mongoose =require('mongoose')

const ConversationSchema=new mongoose.Schema({
  senderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  receiverIds:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
  ],
  messages:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message",
    },
  ],
},{timestamps:true});

const Conversation=mongoose.model('Conversation',ConversationSchema);

module.exports=Conversation;