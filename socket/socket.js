const express = require('express')

const app = express();

const { Server } = require('socket.io');
const http = require('http');


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["*"],
    methods: ["GET", "POST"]
  }
})

const userSocketMap = {};
const emailToSockeIdMap = new Map();
const socketIdtoEmail = new Map();
// console.log("ss");
io.on('connection', (socket) => {
  console.log("connected ", socket.id);
  const userid = socket.handshake.query.userId;
  // console.log(socket.handshake.query);
  if (userid != "undefined") {
    userSocketMap[userid] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("disconnected", socket.id);
    delete userSocketMap[userid];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  })




  socket.on("room:join", (data) => {
    emailToSockeIdMap.set(data.email, socket.id);
    socketIdtoEmail.set(socket.id, data.email);
    const room = data.room;
    console.log("joined", data);
    io.to(room).emit("user:joined", { email: data.email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  })

  socket.on('user:call', ({ offer, to,from }) => {
    // console.log(Object.keys(userSocketMap));
    // console.log(userSocketMap[to], "to", to);
    io.to(userSocketMap[to]).emit('incoming:call', {
      offer,
      from,
      to
    });
  });

  socket.on('call:accepted', ({ to, ans,from }) => {
    if(!to || !userSocketMap[to]){
      console.log("User not found or not connected When call accepted");
      return;
    }
    io.to(userSocketMap[to]).emit('call:accepted', { from,to, ans })
  })

  socket.on("peer:nego:needed", ({ to, offer,from }) => {
    // console.log("peer nego needed", offer);
    try {
      // console.log(to, "  ", userSocketMap[to]);
      if(!to || !userSocketMap[to]){
        console.log(to,"User not found or not connected When nego needed");
        return;
      }
      io.to(userSocketMap[to]).emit("peer:nego:needed", { from,to, offer });
      // console.log("Inside Try Catch nego needed");
    } catch (error) {
      console.log(error.message);
    }
  })

  socket.on("peer:nego:done", ({ to, ans,from }) => {
    // console.log("peer nego done", ans);
    if(!to || !userSocketMap[to]){
      console.log("User not found or not connected When nego done");
      return;
    }
    io.to(userSocketMap[to]).emit("peer:nego:final", { from,to, ans });
  })
  
  
  // if(!to || !userSocketMap[to]){
  //   console.log("User not found or not connected When nego done");
  //   return;
  // }
})


const getSocketId = (receiverId) => {
  return userSocketMap[receiverId];
}



// console.log("")
module.exports = { app, server, io, getSocketId };




