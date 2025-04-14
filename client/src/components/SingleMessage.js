
import React, { useContext } from 'react';
import './SingleMessage.css';
import userContext from '../contexts/users/UserContext';
import { DateDiff } from './DateDiff';
import { Avatar } from '@mui/material';

function SingleMessage({ Sid, message, time }) {
  const { curId, user, curuser } = useContext(userContext);

  const isMe = Sid === curId;
  const sender = isMe ? curuser : user;
  const messageDate = new Date(time);

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
          <p className="message-text mb-1">{message}</p>
          <div className="message-meta text-muted small" title={fullTime}>
            {status} • {localTime}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleMessage;
