// export default MessagePage;
import React, { useContext, useEffect, useRef, useState } from 'react';
import userContext from '../contexts/users/UserContext';
import SingleMessage from './SingleMessage';
import './MessagePage.css';
import UselistenHook from '../contexts/users/UselistenHook';
import EmojiPicker from 'emoji-picker-react';
import { Avatar } from '@mui/material';

function MessagePage({ dis }) {

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);


  const usrcntx = useContext(userContext);
  const {
    user, messages, SendMessage, selected, isLoading,
    curuser, setSelected, curId, selectedGroup, setSelectedGroup,
    sendGroupMessage, groupChat, getChatId, setShowCall
  } = usrcntx;


  const [chatId, setChatId] = useState(null);
  useEffect(() => {
    // console.log(messages)
    if (selected) {
      setChatId(getChatId(curId, selected));
    }
    else {
      setChatId(selectedGroup);
    }
    // console.log(chatId)
    //  console.log(messages)
  }, [selected, selectedGroup])

  // setChatId(getChatId(curId,selected));
  const [message, setMessage] = useState("");
  const lastmsgRef = useRef();
  const emojiRef = useRef();
  const [showEmoji, setShowEmoji] = useState(false);

  const handleEmojiClick = (emojiObject) => {
    // console.log(emojiObject)
    setMessage((prev) => prev + emojiObject.emoji);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [emojiRef]);


  useEffect(() => {
    lastmsgRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  UselistenHook();

  const handleSend = async () => {
    if (!message.trim() && !selectedFile) return;
  
    if (selectedGroup) {
      await sendGroupMessage(selectedGroup, message, selectedFile);
    } else if (selected) {
      await SendMessage(selected, message, selectedFile);
    }
  
    setMessage("");
    clearPreview(); 
  };
  

  const chattingWith = selectedGroup
    ? groupChat?.name || "Group"
    : user
      ? `${selected === curId ? user.name + " (You)" : user.name}`
      : "User";

  const handleFileIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const clearPreview = () => {
    setSelectedFile(null);
    setPreviewURL(null);
  };

  return (
    <div className="chatlist2 d-flex flex-column w-100">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
        {dis === 1 && (
          <i
            onClick={() => { setSelected(null); setSelectedGroup(null); }}
            className="fa-solid fa-angles-left fs-4 text-primary"
            style={{ cursor: 'pointer' }}
          ></i>
        )}
        <h5 className="Chatwith">Chatting with {chattingWith}</h5>
        {selected && <div>
          <Avatar src="telephone.webp" alt="call" onClick={() => setShowCall(true)} />

        </div>}
      </div>
      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        <div className="allmessages flex-grow-1 overflow-auto px-3 py-2">
          {(selected || selectedGroup) ? (
            !isLoading ? (
              messages && messages[chatId]?.length ? (
                messages[chatId]?.map((message, id) => (
                  <div key={id} ref={lastmsgRef}>
                    {/* {console.log(message)} */}
                    <SingleMessage
                      time={message?.updatedAt}
                      Sid={message?.senderId}
                      message={message?.message}
                      url={message?.fileUrl}
                      messageType={message?.messageType}
                    />
                  </div>
                ))
              ) : (
                <p className="text-muted text-center">Send a message to start the conversation.</p>
              )
            ) : (
              <p className="text-center">Loading...</p>
            )
          ) : (
            <div className="text-center py-5">
              <h3>Welcome {curuser?.name}</h3>
              <p>👋 Select a user or group to start chatting</p>
            </div>
          )}
        </div>

        {/* Footer - Message Input */}
        <div ref={emojiRef}>
          {previewURL && (
            <div className="file-preview d-flex align-items-center p-2 gap-2">
              <img
                src={previewURL}
                alt="preview"
                style={{ maxHeight: '100px', borderRadius: '8px' }}
              />
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={clearPreview}
              >
                ❌
              </button>
            </div>
          )}

          <form
            className="p-3 d-flex gap-2 align-items-center"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {/* Clickable Paperclip Icon */}
            <i
              className="fa fa-paperclip"
              aria-hidden="true"
              onClick={handleFileIconClick}
              style={{ cursor: 'pointer', fontSize: '18px', color: '#555' }}
            ></i>
            <div className='msgInput' >
              <input
                className="form-control"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
              />
            </div>
            <i onClick={(e) => {
              setShowEmoji(!showEmoji);
            }} className="fa-solid fa-face-smile"></i>
            <button type="submit" className="btn btn-primary">Send</button>
          </form>
          <div>
            <EmojiPicker
              theme='dark'
              autoFocusSearch={false}
              onEmojiClick={handleEmojiClick}
              width={"90%"}
              height={'45vh'}
              open={showEmoji} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessagePage;