import  { useContext, useEffect, } from 'react'
import userContext from './UserContext';

function UselistenHook() {

    const { socket, messages, setmessages } = useContext(userContext);

    // console.log(socket);
    useEffect(() => {
        socket?.on("newMessage",(newMessage)=>{
            setmessages([...messages,newMessage]);
           })
          return ()=> socket?.off("newMessage");
    },[messages,setmessages,socket]);
}

export default UselistenHook