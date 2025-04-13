import React, { useEffect, useState } from 'react'
import userContext from './UserContext'
import { jwtDecode } from "jwt-decode"
import io from "socket.io-client"

function UserState(props) {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [users, setallUsers] = useState([]);
  const [friends,setFriends]=useState([]);
  const [isLoading, setLoading] = useState(true);
  const [messages, setmessages] = useState({});
  const [user, setuser] = useState();
  const [curuser, setcuruser] = useState(null);
  const [curId, setCurId] = useState(localStorage.getItem('id') || null);

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupChat, setGroupChat] = useState(null);


  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const JWT_SECRET = "ThisisSecretKey";

  const getAllUsers = async () => {
    const response = await fetch("api/auth/getall", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authtoken": JSON.stringify(localStorage.getItem("token")),
      },
    });
    const json = await response.json();
    // console.log(json)
    setallUsers(json);
  };
  const getFriends = async () => {
    const response = await fetch("api/auth/getuser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authtoken": JSON.stringify(localStorage.getItem("token")),
      },
    });
    const json = await response.json();
    // console.log("fri",json.contacts)
    setcuruser(json);
    setFriends([...json.contacts,json]);
  };

  const fetchUserGroups = async () => {
    const res = await fetch("/api/group/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authtoken": JSON.stringify(localStorage.getItem("token"))
      }
    });
    const json = await res.json();
    if (json.success) {
      setGroups(json.groups);
    }
  };

  const getChatId=(id1,id2)=>{
    return [id1,id2].sort().join('_');
  }

  const getMessages = async (id, token) => {
    const chatId=getChatId(id,curId);
    // console.log(messages[chatId].length);
      // console.log("nhi Aaye");
      const response=await fetch(`/api/message/get/${id}`,{
        method:"GET",
        headers:{
          "Content-Type":"application/json",
        "authtoken":JSON.stringify(token),
      }
    })
    const json=await response.json();
    if(json.success)
      {
        setmessages(prev => ({
          ...prev,
          [chatId]: json.messages,
        }));
      }
      setLoading(false);
    };
    
    const getGroupMessages = async (groupId) => {
      // console.log(messages[groupId]);
      // console.log(" Group me bhi nhi Aaye");
    const response = await fetch(`api/group/get/${groupId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authtoken": JSON.stringify(localStorage.getItem("token")),
      },
    });
    const json = await response.json();
    if (json.success) {
      setmessages(prev => ({
        ...prev,
        [groupId]: json.messages,
      }));
    }
    setLoading(false);
  };

  const sendGroupMessage = async (groupId, message) => {
    const response = await fetch(`api/group/send/${groupId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authtoken": JSON.stringify(localStorage.getItem("token")),
      },
      body: JSON.stringify({ message })
    });
    const json = await response.json();
    setmessages(prev =>({
      ...prev,
      [groupId]: [...(prev[groupId] || []),json.message],
    }));
  };

  const createGroup = async (groupName, memberIds) => {
    const response = await fetch("api/group/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authtoken": JSON.stringify(localStorage.getItem("token")),
      },
      body: JSON.stringify({ groupName, memberIds })
    });
    const json = await response.json();
    if (json._id) {
      setGroups(prev => [...prev, json]);
    }
  };

  useEffect(() => {
    if (curId) {
      getAllUsers();
      fetchUserGroups();
      getFriends();
    }
  }, [curId]);

  useEffect(() => {
    setLoading(true);
    setuser(user || curuser);
    friends?.forEach(friend => {
      if (friend._id === selected) {
        setuser(friend);
      }
    });

    if (selected) {
      getMessages(selected, localStorage.getItem("token"));
      // console.log(messages);
    }

    if (selectedGroup) {
      getGroupMessages(selectedGroup);
    }
    setLoading(false)
  }, [selected, selectedGroup]);

  const SendMessage = async (id, message, token) => {
    const chatId=getChatId(id,curId);
    const response = await fetch(`api/message/send/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authtoken": JSON.stringify(token)
      },
      body: JSON.stringify({ message })
    });
    const json = await response.json();
    setmessages(prev =>({
      ...prev,
      [chatId]: [...(prev[chatId] || []),json.message],
    }));
  };

  useEffect(() => {
    if (curId) {
      const socketInstance = io(window.location.href, {
        query: { userId: curId },
      });
      socketInstance.connect();
      setSocket(socketInstance);

      socketInstance.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => socketInstance.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [curId]);


  const addFriend=async(friendId)=>{
          const response =await fetch("api/auth/addfriend",{
            method:"PUT",
            headers:{
              "authtoken":JSON.stringify(localStorage.getItem('token')),
              "Content-Type":"application/json"
            },
            body:JSON.stringify({friendId})
            }
          )
          const json=await response.json();
          if(json.success){
              setFriends([...friends,json.friend]);
          }
  }

  return (
    <userContext.Provider
      value={{
        socket, onlineUsers, selected, curuser, isLoading, setLoading,
        setcuruser, setCurId, setSelected, users, SendMessage, getAllUsers,
        user, setuser, messages, setmessages, getMessages, curId,
        groups, setGroups, selectedGroup, setSelectedGroup, groupChat, setGroupChat,
        getGroupMessages, sendGroupMessage, createGroup, fetchUserGroups,
        theme, toggleTheme,friends,setFriends,addFriend,getChatId
      }}
    >
      {props.children}
    </userContext.Provider>
  );
}

export default UserState;