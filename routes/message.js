const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const Message = require('../models/Message');
const { getSocketId } = require('../socket/socket');
const router = express.Router();
const { io } = require('../socket/socket');

const multer = require('multer');

const path = require('path'); // Add this at the top if missing

// Move multer config ABOVE routes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });


const getChatId = (id1, id2) => {
    return [id1, id2].sort().join('_');
};

// router.post('/send/:id',fetchuser,async (req,res)=>{

//     try {

//         const senderId = req.user.id;
//         const receiverId=req.params.id;
//         const {message}= req.body;

//         const newMessage=await Message.create({
//             message:message,
//             senderId:senderId,
//             chatId:getChatId(senderId,receiverId)
//         })
//       const receiverSocketId=getReceiverSocketId(receiverId);
//     //   console.log(receiverSocketId);
//          if(receiverSocketId)
//          {
//              io.to(receiverSocketId).emit("newMessage",newMessage);
//          }

//         res.status(201).json({"message":newMessage});

//     } catch (error) {
//         console.log(error.message);
//         res.status(200).json("Internal Server Error.");
//     }
// });


router.post('/send/:id', fetchuser, upload.single('file'), async (req, res) => {
    let success = false;
    try {
        const senderId = req.user.id;
        const receiverId = req.params.id;
        const { encryptedMessage } = req.body;
        const { encryptedSenderKey } = req.body;
        const { encryptedReceiverKey } = req.body;
        console.log(encryptedReceiverKey);
        const file = req.file;

        const newMsgData = {
            senderId: senderId,
            chatId: getChatId(senderId, receiverId),
        };

        if (file) {
            newMsgData.messageType = "file";
            newMsgData.fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        } else{
            newMsgData.messageType = "text";
            newMsgData.encryptedMessage = encryptedMessage;
            newMsgData.encryptedKeys={
                sender:encryptedSenderKey,
                receiver:encryptedReceiverKey
            }
        } 

        const newMessage = await Message.create(newMsgData);

        const receiverSocketId = getSocketId(receiverId);
        const senderSocketId = getSocketId(senderId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("newMessage", newMessage);
        }
        success = true;
        res.status(200).json({ message: newMessage, success });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal Server Error.", success });
    }
});


router.get('/get/:id', fetchuser, async (req, res) => {
    let success = false;
    try {
        const senderId = req.user.id;
        const receiverId = req.params.id;
        const chatId = getChatId(senderId, receiverId);
        const messages = await Message.find({ chatId });
        success = true;
        res.status(201).json({ success, messages });
    } catch (error) {
        console.log(error.message);
        res.status(501).json({ success });
    }
})


module.exports = router