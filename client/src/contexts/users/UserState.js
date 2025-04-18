import React, { useEffect, useRef, useState } from 'react'
import userContext from './UserContext'
import { ReactPlayer } from "react-player"
import io from "socket.io-client"

function UserState(props) {
  const [incomingCall, setIncomingCall] = useState(null);
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
  const [showCall, setShowCall] = useState(false);

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
    setFriends([...json.contacts, json]);
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

  const getChatId = (id1, id2) => {
    return [id1, id2].sort().join('_');
  }

  const getMessages = async (id, token) => {
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

  // const sendGroupMessage = async (groupId, message) => {
  //   const response = await fetch(`api/group/send/${groupId}`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "authtoken": JSON.stringify(localStorage.getItem("token")),
  //     },
  //     body: JSON.stringify({ message })
  //   });
  //   const json = await response.json();
  //   setmessages(prev => ({
  //     ...prev,
  //     [groupId]: [...(prev[groupId] || []), json.message],
  //   }));
  // };


  const sendGroupMessage = async (groupId, message, file = null) => {
    try {
      const formData = new FormData();
      if (file) formData.append('file', file);
      if (message?.trim()) formData.append('message', message);
  
      const res = await fetch(`/api/group/send/${groupId}`, {
        method: 'POST',
        headers: {
          'authtoken': JSON.stringify(localStorage.getItem('token')),
        },
        body: formData,
      });
  
      const data = await res.json();
      return data.message;
  
    } catch (err) {
      console.error("sendGroupMessage error:", err);
    }
  };
  
    const SendMessage = async (receiverId, message, file = null) => {
      try {
        const formData = new FormData();
        if (file) formData.append('file', file);
        if (message?.trim()) formData.append('message', message);
    
        const res = await fetch(`/api/message/send/${receiverId}`, {
          method: 'POST',
          headers: {
            'authtoken': JSON.stringify(localStorage.getItem('token')),
          },
          body: formData,
        });
    
        const data = await res.json();
        // Optionally update messages state with new message
        return data.message;
    
      } catch (err) {
        console.error("SendMessage error:", err);
      }
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

  // const SendMessage = async (id, message, token) => {
  //   const chatId = getChatId(id, curId);
  //   const response = await fetch(`api/message/send/${id}`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "authtoken": JSON.stringify(token)
  //     },
  //     body: JSON.stringify({ message })
  //   });
  //   const json = await response.json();
  //   setmessages(prev => ({
  //     ...prev,
  //     [chatId]: [...(prev[chatId] || []), json.message],
  //   }));
  // };
  

  useEffect(() => {
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
  }, [curId]);



  const addFriend = async (friendId) => {
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
  }



  // const [stream, setStream] = useState(null);
  // const [rstream, setrStream] = useState(null);
  // const localVideoRef = useRef();
  // const remoteVideoRef = useRef();
  // const peerRef = useRef();

  // const createPeer = (to) => {
  //   const peer = new RTCPeerConnection();

  //   if (stream) {
  //     stream.getTracks().forEach((track) => {
  //       peer.addTrack(track, stream);
  //     });
  //   }

  //   peer.ontrack = (event) => {
  //     console.log("onTrack");
  //     if (event.streams && event.streams[0]) {
  //       // Create a new MediaStream to ensure fresh reference
  //       const remoteStream = new MediaStream(event.streams[0]);
  //       console.log('Received remote tracks:', remoteStream);
  //       // const thisVideo=thisVideoRef.current;
  //       // thisVideo.srcObject=stream
  //       const remoteVideo = remoteVideoRef.current;
  //       remoteVideo.srcObject = remoteStream;
  //       setrStream(remoteStream);
  //     }
  //   };

  //   peer.onicecandidate = (event) => {
  //     if (event.candidate) {
  //       socket.emit("ice-candidate", {
  //         candidate: event.candidate,
  //         to: selected,
  //         from: curId
  //       });
  //     }
  //   };

  //   return peer;
  // };

  // // ✅ Accept Call - only place where ontrack is set
  // const acceptCall = async () => {
  //   setShowCall(true);
  //   const peer =  createPeer();

  //   // Clear previous stream reference
  //   setrStream(null);
  //   console.log("mystream",stream)
  //   if (stream) {
  //     console.log("Sending Tracks");
  //     stream.getTracks().forEach((track) => {
  //       peer.addTrack(track, stream);
  //     });
  //   }


  //   peer.ontrack = (event) => {
  //     console.log("onTrack");
  //     if (event.streams && event.streams[0]) {
  //       // Create a new MediaStream to ensure fresh reference
  //       const remoteStream = new MediaStream(event.streams[0]);
  //       console.log('Received remote tracks:', remoteStream);
  //       // const thisVideo=thisVideoRef.current;
  //       // thisVideo.srcObject=stream
  //       const remoteVideo = remoteVideoRef.current;
  //       console.log(remoteVideo,remoteStream);
  //       remoteVideo.srcObject = remoteStream;
  //       setrStream(remoteStream);
  //     }
  //   };

  //   try {
  //     await peer.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
  //     const answer = await peer.createAnswer();
  //     await peer.setLocalDescription(answer);
  //     console.log("Inside Accept make answer")
  //     socket.emit("make-answer", { answer, to: selected, from: curId });
  //   } catch (err) {
  //     console.error("Error accepting call:", err);
  //     setShowCall(false);
  //     return;
  //   }

  //   peerRef.current = peer;
  //   setIncomingCall(null);
  // };

  // const rejectCall = () => {
  //   setIncomingCall(null);
  // }



  // // ... everything else unchanged (message handling, friends, groups, etc.)

  // // === useEffect for socket.io listeners ===
  // useEffect(() => {
  //   if (!socket) return;

  //   socket.on("call-made", ({ to, from, offer }) => {
  //     const friend = friends.find((f) => f._id === from);
  //     setIncomingCall({
  //       from_name: friend ? friend.name : "Unknown",
  //       from,
  //       offer
  //     });
  //   });

  //   socket.on("answer-made", async ({ answer, from, to }) => {
  //     console.log("answer Made",peerRef.current.currentRemoteDescription);
  //     if (!peerRef.current.currentRemoteDescription) {
  //       try {
  //         await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
  //       } catch (err) {
  //         console.error("Failed to set remote description:", err);
  //       }
  //     }
  //   });

  //   socket.on("ice-candidate", async ({ candidate, from, to }) => {
  //     if (peerRef.current && candidate) {
  //       try {
  //         await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
  //       } catch (err) {
  //         console.error("Failed to add ICE candidate:", err);
  //       }
  //     }
  //   });
  //   if(peerRef && peerRef.current){
  //     peerRef.current.ontrack = (event) => {
  //       console.log("onTrack");
  //       if (event.streams && event.streams[0]) {
  //         // Create a new MediaStream to ensure fresh reference
  //         const remoteStream = new MediaStream(event.streams[0]);
  //         console.log('Received remote tracks:', remoteStream);
  //         // const thisVideo=thisVideoRef.current;
  //         // thisVideo.srcObject=stream
  //         const remoteVideo = remoteVideoRef.current;
  //         remoteVideo.srcObject = remoteStream;
  //         setrStream(remoteStream);
  //       }
  //     }
  //   };

  // }, [socket]);

  // const startCamera = async () => {
  //   try {
  //     const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  //     setStream(currentStream);
  //     localVideoRef.current.srcObject = currentStream;
  //     if(peerRef.current){
  //       console.log("sending here ")
  //       currentStream.getTracks().forEach((track) => {
  //         peerRef.current.addTrack(track, currentStream);
  //       });
  //     }
  //   } catch (err) {
  //     console.error("Error accessing media devices:", err);
  //   }
  // };

  // const callUser = async () => {
  //   if (!selected) return alert("No user selected to call.");
  //   const peer = createPeer(selected);
  //   const offer = await peer.createOffer();
  //   await peer.setLocalDescription(offer);
  //   socket.emit("call-user", { offer, to: selected, from: curId });
  //   peerRef.current = peer;
  // };


  return (
    <userContext.Provider
      value={{
        socket, onlineUsers, selected, curuser, isLoading, setLoading,
        setcuruser, setCurId, setSelected, users, SendMessage, getAllUsers,
        user, setuser, messages, setmessages, getMessages, curId,
        groups, setGroups, selectedGroup, setSelectedGroup, groupChat, setGroupChat,
        getGroupMessages, sendGroupMessage, createGroup, fetchUserGroups,
        theme, toggleTheme, friends, setFriends, addFriend, getChatId
      }}
    >
      {props.children}
      {/* {stream && <ReactPlayer url={stream}/>} */}

    </userContext.Provider>
  );
}

export default UserState;