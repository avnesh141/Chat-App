const express =require('express')

const app=express();

const {Server} =require('socket.io');
const http =require('http');


const server=http.createServer(app);

const io= new Server(server,{
    cors:{
        origin:["*"],
        methods:["GET","POST"]
    }
})

const userSocketMap={};
console.log("ss");
io.on('connection',(socket)=>{
    console.log("connected ",socket.id);

    const userid = socket.handshake.query.userId;
    // console.log(socket.handshake.query);
    if(userid != "undefined")
    {
        userSocketMap[userid]=socket.id;
    }
   
    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        console.log("disconnected",socket.id);
        delete userSocketMap[userid];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })

})


const getReceiverSocketId=(receiverId)=>{
    return userSocketMap[receiverId];
}



// console.log("")
module.exports={app,server,io,getReceiverSocketId};




