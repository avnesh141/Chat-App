import React, { useEffect, useState } from 'react'
import userContext from './UserContext'
import { jwtDecode } from "jwt-decode"
import io from "socket.io-client"

function UserState(props) {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [users, setallUsers] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [messages, setmessages] = useState(null);
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
    const response = await fetch("api/auth/getusers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authtoken": JSON.stringify(localStorage.getItem("token")),
      },
    });
    const json = await response.json();
    await json.forEach(element => {
      if (element._id === curId) {
        setcuruser(element);
      }
    });
    setallUsers(json);
    fetchUserGroups(); // Ensure groups are fetched after users
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

  const getMessages = async (id, token) => {
    const decoded = jwtDecode(JSON.stringify(token), JWT_SECRET);
    const response1 = await fetch(`api/message/get/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authtoken": JSON.stringify(token),
      }
    });
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
      });
      const json2 = await response2.json();
      if (json2.success && decoded.user.id !== id) {
        msgs = msgs.concat(json2.messages);
      }
      if (msgs.length === 0) return;
      msgs.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    }
    setmessages(msgs);
    setLoading(false);
  };

  const getGroupMessages = async (groupId) => {
    const response = await fetch(`api/group/get/${groupId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authtoken": JSON.stringify(localStorage.getItem("token")),
      },
    });
    const json = await response.json();
    if (json.success) {
      setmessages(json.messages);
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
    setmessages(prev => [...prev, json]);
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
    }
  }, [curId]);

  useEffect(() => {
    setuser(user || curuser);
    users.forEach(element => {
      if (element._id === selected) {
        setuser(element);
      }
    });

    if (selected) {
      getMessages(selected, localStorage.getItem("token"));
    }

    if (selectedGroup) {
      getGroupMessages(selectedGroup);
    }

    setLoading(true);
  }, [selected, selectedGroup]);

  const SendMessage = async (id, message, token) => {
    const response = await fetch(`api/message/send/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authtoken": JSON.stringify(token)
      },
      body: JSON.stringify({ message })
    });
    const json = await response.json();
    setmessages(prev => [...prev, json]);
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

  return (
    <userContext.Provider
      value={{
        socket, onlineUsers, selected, curuser, isLoading, setLoading,
        setcuruser, setCurId, setSelected, users, SendMessage, getAllUsers,
        user, setuser, messages, setmessages, getMessages, curId,
        groups, setGroups, selectedGroup, setSelectedGroup, groupChat, setGroupChat,
        getGroupMessages, sendGroupMessage, createGroup, fetchUserGroups,
        theme, toggleTheme
      }}
    >
      {props.children}
    </userContext.Provider>
  );
}

export default UserState;