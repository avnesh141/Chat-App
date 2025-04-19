
import React, { useContext, useEffect, useState } from 'react';
import './SingleMessage.css';
import userContext from '../contexts/users/UserContext';
import { DateDiff } from './DateDiff';
import { Avatar } from '@mui/material';
import ChatFilePreview from './ChatFilePreView';
import { decryptForUser, decryptWithAES } from '../contexts/users/MessageEncryption';

function SingleMessage({ Sid, message, messageType, time, url,keys,isGroup}) {
  const { curId, user, curuser,selected,seletedGroup, senderKey,setSenderKey } = useContext(userContext);

  const isMe = Sid === curId;
  const sender = isMe ? curuser : user;
  const messageDate = new Date(time);
  const [privateMessage,setPrivateMessage]=useState("");
  const [groupMessage,setGroupMessage]=useState("");
  // console.log(messageType);
  useEffect(() => {
    if(isGroup || !(messageType==="text") || !keys || !curuser)return;
     let EncryptedKey=null;
      if(isMe){
        EncryptedKey= keys.sender;
      }
      else{
        EncryptedKey= keys.receiver;
      }
      if(EncryptedKey)
      {
        const key=decryptForUser(EncryptedKey,curuser.encryptedPrivateKey,JSON.stringify(localStorage.getItem("password")),curuser.salt);
        const messageDecrypted=decryptWithAES(message,key);
        setPrivateMessage(messageDecrypted);
      }
  }, [keys,curuser])

  useEffect(()=>{
       if(!senderKey || !(messageType=="text"))return;
      //  console.log(message,senderKey,messageType);
       const decrypted=decryptWithAES(message,senderKey);
       setGroupMessage(decrypted);
  },[senderKey])


  const localTime = messageDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  });

  const fullTime = messageDate.toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata'
  });

  const status = DateDiff(time);

  return (
    <div className={`message-wrapper ${isMe ? 'message-right' : 'message-left'}`}>
      <div className="message-bubble shadow-sm">
        <Avatar
          src={sender?.picture || '/user.webp'}
          alt={sender?.name || 'User'}
          className="message-avatar"
        />
        <div className="message-content">

          {messageType == "text" ? <p className="message-text mb-1">
           {isGroup?groupMessage:privateMessage}
          </p> : <ChatFilePreview fileUrl={url} />}
          <div className="message-meta text-muted small" title={fullTime}>
            {status} • {localTime}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleMessage;
