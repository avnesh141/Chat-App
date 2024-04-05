import React, { useEffect, useState } from 'react'
import userContext from './UserContext'
import { jwtDecode } from "jwt-decode"
import io from "socket.io-client"
function UserState(props) {
  
  
  const [socket,setSocket]=useState(null);
  const [onlineUsers,setOnlineUsers]=useState([]);
  const [selected, setSelected] = useState(null);
  const [users, setallUsers] = useState([]);
  const [isLoading,setLoading]=useState(true);
  const [messages, setmessages] = useState();
  
  const [user, setuser] = useState();
  const [curuser, setcuruser] = useState();
  const [curId, setCurId] = useState(localStorage.getItem('id') || null);
  const getAllUsers = async () => {
    const response = await fetch("api/auth/getusers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authtoken": JSON.stringify(localStorage.getItem("token")),
      },
    })
    const json = await response.json();
    await json.forEach(element => {
        if(element._id===curId)
        {
          setcuruser(element);
        }
    });
    setallUsers(json);
  }



  const JWT_SECRET = "ThisisSecretKey";

  
  const getMessages = async (id, token) => {
    const decoded = jwtDecode(JSON.stringify(token), JWT_SECRET);
    const response1 = await fetch(`api/message/get/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authtoken": JSON.stringify(token),
      }
    })
    const json1 = await response1.json();
    let msgs = [];
    if (json1.success) {
      msgs = json1.messages;

      const authtoken = json1.authtoken;
      const response2 = await fetch(`api/message/get/${decoded.user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "authtoken": JSON.stringify(authtoken),
        }
      })
      const json2 = await response2.json();
      if (json2.success && decoded.user.id != id) {
        msgs = msgs.concat(json2.messages);
      }
      if(msgs==[])
      {
        return;
      }
      msgs.sort(function (a, b) {
        return a.updatedAt > b.updatedAt?1:-1;
      });

    }
    setmessages(msgs);
    setLoading(false);
  }



  
  useEffect(() => {
    getAllUsers();
  },[users])
  
  useEffect(() => {
    users.forEach(element => {
      if(element._id===selected)
      {
        setuser(element);
      }
    });
    if(selected){
      getMessages(selected,localStorage.getItem("token"));
    }
    // console.log(messa)
    setLoading(true);
  }, [selected])
  


  const SendMessage = async (id, message, token) => {

    // console.log(id,message,token);

    const response = await fetch(`api/message/send/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authtoken": JSON.stringify(token)
      },
      body: JSON.stringify({ message })
    })
    const json = await response.json();
    // console.log(json);
    setmessages([...messages,json]);
    // console.log(messages);
  }

// console.log(window.location.origin);
    useEffect(() => {
      // console.log(curId);

      if(curId)
      {
        console.log(curId);
        const socket=io(window.location.href,{
          query:{
            userId:curId,
          },
          transports: ['websocket', 'polling', 'flashsocket']
        });

        // socket.connect();
    
         setSocket(socket);

         socket.on("getOnlineUsers",(users)=>{
          // console.log(users)
           setOnlineUsers(users);
         })
        //  console.log(onlineUsers);
         return ()=>socket.close();
      }
      else
      {
        if(socket)
        {
            socket.close();
            setSocket(null);
        }
      }

    },[curId])


   


  return (
    <userContext.Provider
      value={{socket,onlineUsers, selected,curuser,isLoading,setLoading,setcuruser,setCurId ,setSelected, users, SendMessage, getAllUsers, user, setuser, messages, setmessages, getMessages, curId }}
    >{props.children}</userContext.Provider>
  )
}

export default UserState