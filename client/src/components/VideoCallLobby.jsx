import React, { useCallback, useContext, useEffect, useState } from 'react'
import userContext from '../contexts/users/UserContext';
import {io} from "socket.io-client"
import { useNavigate } from 'react-router-dom';

function VideoCallLobby() {
    
    const {socket}=useContext(userContext);

    // console.log(window.location.href);
   
    const navigate=useNavigate();

    const [email,setEmail]=useState("");
    const [room,setRoom]=useState("");
    const handleClick=useCallback((e)=>{
        e.preventDefault();
        console.log(email,room);
        if(!socket)return;
        socket.emit("room:join",{email,room});
        console.log("joined");
    },[socket,email,room])

   const handleJoin=useCallback((data)=>{
      const {email,room}=data;
      navigate(`/call/${room}`)
   })

    useEffect(() => {
        if(!socket)return;
       socket.on("room:join",handleJoin);
       return ()=>{
        socket.off("room:join",handleJoin);
       }
    }, [socket])        
    

  return (
    <div>
        <form action="">
            <label htmlFor="email">Email</label>
            <input type="email" value={email} onChange={(e)=>{
                setEmail(e.target.value);
            }} />
            <label htmlFor="email">Room ID</label>
            <input type="number" value={room} onChange={(e)=>{
                setRoom(e.target.value)
            }}/>
            <button onClick={handleClick}>
                Join
            </button>
        </form>
    </div>
  )
}

export default VideoCallLobby