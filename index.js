const express = require('express');
const {server,app}=require('./socket/socket')
// const app = express();
app.use(express.json());
const mongoose = require('mongoose');
var cors = require('cors');
app.use(cors());
app.use('/uploads', express.static('uploads'));

// const path=require('path')

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const { MONGODB_URI } = require("./config/key");
// console.log(MONGODB_URI);
const port = process.env.PORT || 5000;

const fs = require('fs');
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

mongoose.set('strictQuery', 'true');

const connectTomongo = () => {
    mongoose.connect(MONGODB_URI).then(() => {
        console.log("connected to mongo Succesfully");
    }).catch((error) => {
        console.log(error);
    })
}

connectTomongo();



app.use('/api/auth',require('./routes/auth'));
app.use('/api/message',require('./routes/message'));
app.use('/api/group', require('./routes/group'));




// if (process.env.NODE_ENV == "production") {
  const path = require("path");

  app.get("/", (req, res) => {
    app.use(express.static(path.resolve(__dirname, "client", "build")));
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
// }


server.listen(port,'0.0.0.0',()=>{
    console.log("App listening at port number 5000")
})