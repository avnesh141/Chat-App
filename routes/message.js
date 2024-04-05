const express =require('express');
const fetchuser = require('../middleware/fetchuser');
const Conversation = require('../models/Conversation');
const Message= require('../models/Message');
const jwt = require("jsonwebtoken");
const { getReceiverSocketId } = require('../socket/socket');
const JWT_SECRET = "ThisisSecretKey";
const router =express.Router();
const {io}=require('../socket/socket');

router.post('/send/:id',fetchuser,async (req,res)=>{
    
    try {

        const senderId = req.user.id;
        const receiverId=req.params.id;
        const {message}= req.body;

        let conversation= await Conversation.findOne({
            receiverIds:{
                $all:[receiverId]
            },
            senderId:senderId
        });
        // console.log(conversation);
        if(!conversation){
           conversation = await Conversation.create({
                receiverIds:[receiverId],
                senderId:senderId
            });
        }
        
        // console.log(conversation);
        const newMessage = await Message.create({
            senderId:senderId,
            receiverId:receiverId,
            message:message,
        });
        // console.log(newMessage);
        // console.log("smsdm");
        if(newMessage){
            // console.log("first");
            conversation.messages.push(newMessage._id);
        }
        await conversation.save();
        // console.log("godnd")

      const receiverSocketId=getReceiverSocketId(receiverId);
    //   console.log(receiverSocketId);
         if(receiverSocketId)
         {
             io.to(receiverSocketId).emit("newMessage",newMessage);
         }
    
        res.status(201).json(newMessage);

    } catch (error) {
        console.log(error.message);
        res.status(200).json("Internal Server Error.");
    }
});


router.get('/get/:id',fetchuser,async (req,res)=>{
    let success=false;
    try {
         
        const senderId = req.user.id;
        const receiverId=req.params.id;
        let conversation= await Conversation.findOne({
            receiverIds:{
                $all:[receiverId]
            },
            senderId:senderId
        }).populate("messages");
        let messages=[];
        // console.log("first")
        const data = {
            user: {
              id: req.params.id,
            },
          };
        const authtoken = jwt.sign(data, JWT_SECRET);
        if(conversation==null)
        {
            success=true;
            // console.log("first")
            return res.status(200).json({success,messages,authtoken});
            // return;
        }
        messages=conversation.messages;
        success=true;
        res.status(201).json({success,messages,authtoken});
    } catch (error) {
        res.status(501).json({success});
    }
})


module.exports=router