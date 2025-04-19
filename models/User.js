const mongoose = require("mongoose");
const { Schema } = mongoose;
const UserSchema = new Schema({
  name: {
    type: String,
    requireed: true,
    unique: false,
  },
  email: {
    type: String,
    required: true,
    unique: false,
  },
  number: {
    type: Number,
    default:null
  },
  password: {
    type: String,
    unique: false,
    default:null
  },
  salt:{
       type:String,     
  },
  publicKey: {
    type:String,
  },
  encryptedPrivateKey: {
    type:String,
  },
  date: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  contacts:{
    type:[
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    default:[]
  },
  picture:{
    type:String,
    default:"user.webp",
  }
});
const User = mongoose.model("User", UserSchema);
User.createIndexes();
module.exports = mongoose.model("User", UserSchema);
