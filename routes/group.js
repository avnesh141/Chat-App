const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Group = require('../models/Group');
const Message = require('../models/Message');
const { io, getSocketId } = require('../socket/socket');



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

// Create a new group
router.post('/create', fetchuser, async (req, res) => {
  let success = false;
  try {
    const { groupName, memberIds, encryptedSenderKeys } = req.body;
    const group = await Group.create({
      name: groupName,
      members: [...memberIds],
      createdBy: req.user.id,
      senderKeys: encryptedSenderKeys
    });
    success = true;
    res.status(201).json({ group, success });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create group', success });
  }
});


router.get('/sender-keys/:groupId', async (req, res) => {
  try {

    const group = await Group.findById(req.params.groupId);
    // console.log(group.senderKeys);
    console.log(req.params.groupId);
    if (!group) return res.status(404).send('Group not found');
    res.status(200).json(group.senderKeys);
  } catch (error) {

  }
});

// Send a message to group
router.post('/send/:groupId', fetchuser, upload.single('file'), async (req, res) => {
  let success = false;
  try {
    const { encryptedMessage } = req.body;
    const senderId = req.user.id;
    const groupId = req.params.groupId;
    const file = req.file;
    const newMsgData = {
      chatId: groupId,
      senderId,
    }

    if (file) {
      newMsgData.messageType = "file";
      newMsgData.fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
    } else {
      newMsgData.messageType = "text";
      newMsgData.encryptedMessage = encryptedMessage;
    }

    const newMessage = await Message.create(newMsgData);
    console.log(newMessage);

    const group = await Group.findById(groupId);
    group.messages.push(newMessage._id);
    await group.save();

    // Notify group members via socket

    group.members.forEach(uid => {
      // if (uid.toString() !== senderId) {
        // console.log("users id ",uid);
        const sockId = require('../socket/socket').getSocketId(uid.toString());
        if (sockId) {
          
          io.to(sockId).emit("newMessage", newMessage);
        }
      // }
    });
    success = true;
    res.status(200).json({ "message": newMessage, success });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: 'Failed to send message' });
  }
});

// Fetch group messages
router.get('/get/:groupId', fetchuser, async (req, res) => {
  let success = false;
  try {
    const groupId = req.params.groupId;
    const messages = await Message.find({ chatId: groupId });
    if (!messages) return res.status(404).json({ message: 'Messages not found' });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: 'Failed to fetch messages' });
  }
});

router.get('/user', fetchuser, async (req, res) => {
  let success = false;
  try {
    // console.log("Arrived to group route");
    const userId = req.user.id;
    const groups = await Group.find({
      members: { $in: [userId] }
    }).populate('createdBy').populate('messages').populate('members');

    res.status(200).json({ success: true, groups });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch groups' });
  }
});

module.exports = router;
