import React, { useEffect, useState } from 'react'
import userContext from './UserContext'
import io from "socket.io-client"
import { encryptForUser, generateRandomAESKey, getSenderKey } from './MessageEncryption';

function UserState(props) {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [users, setallUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [messages, setmessages] = useState({});
  const [user, setuser] = useState();
  const [curuser, setcuruser] = useState(null);
  const [curId, setCurId] = useState(localStorage.getItem('id') || null);

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupChat, setGroupChat] = useState(null);
  const [selectedChat,setSetSelectedChat]=useState(null);
  const [senderKey, setSenderKey] = useState('');


  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };


  const getAllUsers = async () => {
    try {

      const response = await fetch("api/auth/getall", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "authtoken": JSON.stringify(localStorage.getItem("token")),
        },
      });
      const json = await response.json();
      // console.log(json)
      if (json.success) {
        setallUsers(json.users);
      }
    } catch (error) {
      console.log(error.message)
    }
  };
  const getFriends = async () => {
    try {

      const response = await fetch("api/auth/getuser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "authtoken": JSON.stringify(localStorage.getItem("token")),
        },
      });
      const json = await response.json();
      // console.log("fri",json.contacts)
      if (json.success) {
        setcuruser(json.user);
        console.log(json.user);
        if (json.user.contacts) {
          setFriends([...json.user.contacts, json.user]);
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  };

  const fetchUserGroups = async () => {
    try {

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
    } catch (error) {
      console.log(error.message)
    }
  };

  const getChatId = (id1, id2) => {
    return [id1, id2].sort().join('_');
  }

  const getMessages = async (id, token) => {

    try {

      const chatId = getChatId(id, curId);
      // console.log(messages[chatId].length);
      // console.log("nhi Aaye");
      const response = await fetch(`/api/message/get/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "authtoken": JSON.stringify(token),
        }
      })
      const json = await response.json();
      if (json.success) {
        setmessages(prev => ({
          ...prev,
          [chatId]: json.messages,
        }));
        console.log(json.messages);
      }
      setLoading(false);
    } catch (error) {
      console.log(error.message)
    }
  };

  const getGroupMessages = async (groupId) => {
    try {

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
    } catch (error) {
      console.log(error.message)
    }
  };


  const sendGroupMessage = async (groupId, encryptedMessage, file = null) => {
    try {
      const formData = new FormData();
      if (file) formData.append('file', file)
      else{formData.append('encryptedMessage', encryptedMessage);}

      const res = await fetch(`/api/group/send/${groupId}`, {
        method: 'POST',
        headers: {
          'authtoken': JSON.stringify(localStorage.getItem('token')),
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        return data.message;
      }

    } catch (err) {
      console.error("sendGroupMessage error:", err);
    }
  };

  

  useEffect(() => {
    if(!curuser || !selectedGroup)return;
    (async () => {
      console.log(selectedGroup);
      const key = await getSenderKey(selectedGroup, curuser._id, curuser.encryptedPrivateKey, JSON.stringify(localStorage.getItem('password')), curuser?.salt);
      setSenderKey(key);
      // console.log("sender Key ",key);
    })();
  }, [curuser,curId,selectedGroup]);

  const createGroup = async (groupName, members) => {
    try {

      const senderKey = generateRandomAESKey(); 
      members.push(curuser);// random 256-bit key
      const memberIds=members.map((member)=>{
        return member._id;
      })
      const encryptedSenderKeys = members.map((member) => {
        const encryptedKey = encryptForUser(senderKey, member.publicKey);
        return { user: member._id, encryptedSenderKey: encryptedKey };
      });
    //   console.log(members[0]);
    //   console.log(groupName);
    //  console.log(encryptedSenderKeys);
      const response = await fetch("api/group/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authtoken": JSON.stringify(localStorage.getItem("token")),
        },
        body: JSON.stringify({ groupName, memberIds,encryptedSenderKeys })
      });
      const json = await response.json();
      if (json.success) {
        setGroups(prev => [...prev, json.group]);
      }
    } catch (error) {
      console.log(error.message)
    }
  };

  // export const createGroup = async (groupId, members, senderKey, currentUser, usersPublicKeys) => {
    
   
  //   const res = await axios.post('http://localhost:5000/api/groups', {
  //     groupId,
  //     members,
  //     senderKeys: encryptedSenderKeys,
  //   });
  //   return res.data;
  // };

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
    }

    if (selectedGroup) {
      getGroupMessages(selectedGroup);
    }
    setLoading(false)
  }, [curuser,selected,selectedGroup]);


  useEffect(() => {
    try {

      if (curId) {
        // console.log(window.location.href);
        const socketInstance = io(window.location.href, {
          query: { userId: curId },
          transports: ["webSocket", "polling"]
        });
        socketInstance.connect();
        setSocket(socketInstance);

        socketInstance.on("getOnlineUsers", (users) => {
          setOnlineUsers(users);
        });

        return () => {
          console.log("return disconnect");
          socketInstance.close();
        }
      } else {
        if (socket) {
          console.log("disconnected")
          socket.close();
          setSocket(null);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }, [curId]);



  const addFriend = async (friendId) => {
    try {

      const response = await fetch("api/auth/addfriend", {
        method: "PUT",
        headers: {
          "authtoken": JSON.stringify(localStorage.getItem('token')),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ friendId })
      }
      )
      const json = await response.json();
      if (json.success) {
        setFriends([...friends, json.friend]);
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <userContext.Provider
      value={{
        socket, onlineUsers, selected, curuser, isLoading, setLoading,
        setcuruser, setCurId, setSelected, users, getAllUsers,
        user, setuser, messages, setmessages, getMessages, curId,
        groups, setGroups, selectedGroup, setSelectedGroup, groupChat, setGroupChat,
        getGroupMessages, sendGroupMessage, createGroup, fetchUserGroups,
        theme, toggleTheme, friends, setFriends, addFriend, getChatId,
        selectedChat,setSetSelectedChat,senderKey
      }}
    >
      {props.children}

    </userContext.Provider>
  );
}

export default UserState;