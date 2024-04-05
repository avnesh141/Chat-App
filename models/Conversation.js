const mongoose =require('mongoose')

const ConversationSchema=new mongoose.Schema({
  senderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
  },
  receiverIds:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
  ],
  messages:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message",
    },
  ],
},{timestamps:true});

const Conversation=mongoose.model('conversation',ConversationSchema);

module.exports=Conversation;