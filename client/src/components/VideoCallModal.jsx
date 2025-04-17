import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import userContext from "../contexts/users/UserContext";
import ReactPlayer from "react-player";
import peer from "../service/peer"
const VideoCallModal = () => {


  const { curId, selected, socket } = useContext(userContext);

const [remotSocketId,setRemoteSocketId]=useState();
  const handleUserJoined=useCallback(({email,id})=>{
       console.log("email: ",email,"id: ",id,"joined the room");
       setRemoteSocketId(id);
  },[])

  useEffect(() => {
    if(!socket)return;
    socket.on("user:joined",handleUserJoined);
    
    return () => {
      socket.off("user:joined",handleUserJoined);
    }
  }, [socket,handleUserJoined])
  

  const [canCall, setCanCall] = useState(false);

  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [remoteId,setRemoteId]=useState(null);


  const handleClick = useCallback(() => {
    if (!socket) return;
    console.log(socket);
    socket.emit("join", { curId });
    setCanCall(true);
  }, [socket, curId])


  const handleCallUser = useCallback(async () => {
    setRemoteId(selected)
    console.log(remoteId,selected);
    const stream = await navigator.mediaDevices.getUserMedia(
      {
        audio: true,
        video: true
      }
    );
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remotSocketId, offer });
    setMyStream(stream);
  }, [socket, remotSocketId])

  const handleIncomingCall = useCallback(async ({ from, offer }) => {
    console.log("Incoming Call");
    setRemoteSocketId(from);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
    // console.log("error");
    const ans = await peer.getAnswer(offer);
    socket.emit("call:accepted", { to: from, ans });
  }, [socket])

  const sendStreams=useCallback(()=>{
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  },[myStream])

  const handleCallAccepted = useCallback(async ({ from, ans }) => {
    await peer.setLocalDescription(ans);
    console.log("Call Accepted");
    sendStreams();
  }, [sendStreams]);

  const handleNegotiationNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    // console
    console.log("peer nego",remoteId," ",curId);
    socket.emit('peer:nego:needed', { offer, to: remotSocketId });
  }, [socket,remotSocketId])

  useEffect(() => {

    peer.peer.addEventListener("negotiationneeded", handleNegotiationNeeded)

    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegotiationNeeded)

    }
  }, [handleNegotiationNeeded])


  useEffect(() => {
    peer.peer.addEventListener('track', async (event) => {
      const remoteStream = event.streams[0];
      console.log("Got Tracks");
      setRemoteStream(remoteStream);
    })

  }, [])

  const handleNegoNeededIncoming = useCallback(async ({from, offer}) => {
    console.log("incoming nego");
    const ans = await peer.getAnswer(offer);
    socket.emit("peer:nego:done", { to: from, ans })
  }, [socket])

  const handlenegoFinal = useCallback(async ({ to, from, ans }) => {
    console.log("Done");
    await peer.setLocalDescription(ans);
  }, [])


  useEffect(() => {
    if (!socket) return;
    socket.on("incoming:call", handleIncomingCall)
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeededIncoming);
    socket.on("peer:nego:final", handlenegoFinal);

    return () => {
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeededIncoming);
      socket.off("peer:nego:final", handlenegoFinal);
    }
  }, [socket,handleCallAccepted,handleNegoNeededIncoming])


  return (
    <div className="container align-items-center text-center mx-5">
      <h1>Video Room</h1>
      {remotSocketId &&
      <div>
       <h2>Connected</h2>
               <button onClick={handleCallUser}>
        Call
      </button>
      </div>}
      {remoteStream &&
        <>
          <h2>Remote</h2>
          <ReactPlayer playing url={remoteStream} />
        </>
      }

      {myStream &&
        <>
        <button className="btn btn-primary" onClick={sendStreams}>send Streams</button>
          <h2>My Stream</h2>
          <ReactPlayer muted playing url={myStream} />
        </>
      }
    </div>
  );
};

export default VideoCallModal;