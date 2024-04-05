import React, { useContext, useEffect, useRef, useState } from 'react'
import userContext from '../contexts/users/UserContext'
import SingleMessage from './SingleMessage';
import "./MessagePage.css"
import UselistenHook from '../contexts/users/UselistenHook';
function MessagePage() {

    const usrcntx=useContext(userContext);
    const {user,messages,SendMessage,selected,isLoading,curuser }=usrcntx;
    const [message,setMessage]=useState("");  
     const ele=document.getElementsByClassName('allmessages')[0];
     
     const lastmsgRef=useRef();

     useEffect(() => {
      // setTimeout(() => {
        lastmsgRef.current?.scrollIntoView({behaviour:"smooth"});
      // }, 2000);
     }, [messages])
     

    UselistenHook();
    // console.log(messages)
    const onchange=(e)=>{
      setMessage(e.target.value);
    }  
    const OnSend=()=>{
      if(message)
      {
         if(selected)
         {
           SendMessage(selected,message,localStorage.getItem('token')); 
          }
          setMessage("");
      }
    }

  return (
    <div className="chatlist2" >
          <h4 className='Chatwith mx-4 bg-white'>Chatting with {user?user.name:"User"}</h4>
         { selected &&
          <div className='allmessages'>
            <div>
           {!isLoading && (messages.length ? (messages.map((msg,id)=>(
            <div key={id} ref={lastmsgRef}>
                <SingleMessage    Sid={msg.senderId} message={msg.message}/>
             </div>
                // <h4>Send a message to Start conversation.</h4>
                ))):<h1>Send a message to start conversation</h1>)
            }
            {
              isLoading &&  <h1>Loading</h1>
            }
            </div> 
          </div> }
          {
            !selected && <div style={{display:"block"}}>
            <h3>Welcome {curuser?.name}</h3>
            <h4>👋👋👋</h4>
            <h5>Select an user to start chatting</h5>
              </div>

          }
          <div className='sendMsg'>
            <input className='msgInput' value={message} onChange={onchange} type='text'></input>
            <input className='btn bg-white ' onClick={OnSend}  type='button' value='Send'></input>
          </div>
        </div>
  )
}

export default MessagePage