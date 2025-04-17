// === ChatPage.js (updated) ===
import React, { useContext, useState } from 'react';
import './Chatpage.css';
import userContext from '../contexts/users/UserContext';
import { Avatar } from '@mui/material';
import SecondaryChatPage from './SecondaryChatPage';
import { Route, BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import VideoCallLobby from "./VideoCallLobby"
import VideoCallModal from './VideoCallModal';

function ChatPage() {
  const navigate = useNavigate();
  const {
    setCurId, setuser, curuser, setSelected,
    setmessages, setcuruser, theme, toggleTheme,
  } = useContext(userContext);

  const logout = () => {
    localStorage.clear();
    setCurId(null);
    setSelected(null);
    setmessages(null);
    setcuruser(null);
    setuser(null);
    navigate("/login");
  };
  return (
    <>
      <div className={`Container ${theme}`}>
        <header className="mainheader">
          <div className="container-fluid py-2 px-4 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Avatar src="logo.webp" alt="Logo" height="40" className="me-3" />
              <h3 className="mb-0" onClick={(e)=>{
                navigate('/');
              }}>ChatApp</h3>
            </div>
            <form className="d-none d-md-flex align-items-center w-50">
              <input
                autoComplete="off"
                type="search"
                className="form-control rounded me-2"
                placeholder="Search"
              />
              <i className="fas fa-search text-muted"></i>
            </form>
            <div className="d-flex align-items-center gap-3">
              <button className="btn btn-sm btn-outline-secondary" onClick={toggleTheme}>
                {theme === 'light' ? '🌙' : '☀️'}
              </button>

              <Avatar className='logoutImg' src="logout.webp" alt="User" onClick={logout} style={{ cursor: 'pointer' }} />
              {curuser?.picture && (
                <Avatar
                  src={curuser.picture}
                  alt={curuser.name}
                  className="rounded-circle"
                  height="30"
                />
              )}
            </div>
          </div>
        </header>
        {/* <Router> */}
          <Routes>
            <Route exact path="/" element={<SecondaryChatPage/>}/>
            <Route exact path="/lobby" element={<VideoCallLobby/>}/>
            <Route exact path="/call/:room" element={<VideoCallModal/>}/>
          </Routes>
        {/* </Router> */}
      </div>
    </>
  );
}

export default ChatPage;
