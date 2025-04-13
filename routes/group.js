const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Group = require('../models/Group');
const Message = require('../models/Message');
const { io } = require('../socket/socket');

// Create a new group
router.post('/create', fetchuser, async (req, res) => {
  try {
    const { groupName, memberIds } = req.body;
    const group = await Group.create({
      name: groupName,
      members: [...memberIds, req.user.id],
      createdBy: req.user.id,
    });
    res.status(201).json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create group' });
  }
});

// Send a message to group
router.post('/send/:groupId', fetchuser, async (req, res) => {
  try {
    const { message } = req.body;
    const senderId = req.user.id;
    const groupId = req.params.groupId;

    const newMessage = await Message.create({
      senderId,
      chatId: groupId, // mark groupId in receiverId
      message
    });

    const group = await Group.findById(groupId);
    group.messages.push(newMessage._id);
    await group.save();

    // Notify group members via socket
    group.members.forEach(uid => {
      if (uid.toString() !== senderId) {
        const sockId = require('../socket/socket').getReceiverSocketId(uid.toString());
        if (sockId) {
          io.to(sockId).emit("newMessage", newMessage);
        }
      }
    });

    res.status(201).json({"message":newMessage});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// Fetch group messages
router.get('/get/:groupId', fetchuser, async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId).populate('messages').populate('createdBy');
    if (!group) return res.status(404).json({ message: 'Group not found' });

    res.status(200).json({ success: true, messages: group.messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

router.get('/user', fetchuser, async (req, res) => {
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
