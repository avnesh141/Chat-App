const mongoose = require('mongoose');
const { Schema } = mongoose;

const groupSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  senderKeys: [
    { 
      user: mongoose.Schema.Types.ObjectId,
      encryptedSenderKey: String 
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model("Group", groupSchema);
