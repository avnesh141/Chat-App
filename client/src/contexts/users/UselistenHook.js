import  { useContext, useEffect, } from 'react'
import userContext from './UserContext';

function UselistenHook() {

    const { socket, messages, setmessages } = useContext(userContext);
    // console.log(socket);
    useEffect(() => {
        socket?.on("newMessage",(newMessage)=>{
            // console.log(newMessage);
            setmessages(prev => ({
                ...prev,
                [newMessage.chatId]:[...(prev[newMessage.chatId] || []),newMessage],
              }));
              console.log("newMessage",newMessage);
           })
          return ()=> socket?.off("newMessage");
    },[socket,setmessages]);
}

export default UselistenHook