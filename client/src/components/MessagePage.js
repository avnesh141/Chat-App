import React, { useContext, useEffect, useRef, useState } from 'react'
import userContext from '../contexts/users/UserContext'
import SingleMessage from './SingleMessage';
import "./MessagePage.css"
import UselistenHook from '../contexts/users/UselistenHook';
import { Button } from 'primereact/button';
function MessagePage(props) {

   const wid=props.dis?"95%":"60vw";
   const ht=props.dis?"70vh":"80vh";
  //  console.log(wid);

    const usrcntx=useContext(userContext);
    const {user,messages,SendMessage,selected,isLoading,curuser,setSelected,curId}=usrcntx;
    const [message,setMessage]=useState("");  
     
     const lastmsgRef=useRef();
     const topRef=useRef();

     useEffect(() => {
      // setTimeout(() => {
        lastmsgRef.current?.scrollIntoView({behaviour:"smooth"});
      // }, 2000);
     }, [messages])
     
  // console.log(messages);
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
    <div className="chatlist2" style={{width:`${wid}`,height:`${ht}`}} >
        <div>
         {props.dis==1 && <i onClick={()=>{
           setSelected(null);
         }} className="fa-solid fa-angles-left"></i>} 
          <h4 className='Chatwith mx-4 px-4 bg-white'>Chatting with {user?`${selected==curId?user.name+"(You)":user.name}`:"User"}</h4>
        </div>
          
         { selected &&
          <div className='allmessages'>
            <div>
           {!isLoading && (messages.length ? (messages.map((msg,id)=>(
            <div key={id} ref={lastmsgRef}>
                <SingleMessage time={msg.updatedAt}   Sid={msg.senderId} message={msg.message}/>
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
          <form action='#' className='sendMsg'>
            <input className='msgInput' value={message} onChange={onchange} type='text'/>
            <input className='btn bg-white ' onClick={(e)=>{
              e.preventDefault();
              OnSend();
            }}  type='submit' />
          </form>
        </div>
  )
}

export default MessagePage