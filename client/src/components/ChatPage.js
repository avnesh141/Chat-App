// === ChatPage.js (updated) ===
import React, { useContext, useState } from 'react';
import './Chatpage.css';
import MessageBox from './MessageBox';
import Description from './Description';
import { useNavigate } from 'react-router-dom';
import MessagePage from './MessagePage';
import userContext from '../contexts/users/UserContext';
import GroupModal from './GroupModal';
import FriendModal from './FriendModal';
import { Avatar } from '@mui/material';

function ChatPage() {
  const width = window.innerWidth;
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showfriendModal, setShowFriendModal] = useState(false);
  const navigate = useNavigate();
  const {
    setCurId,selectedGroup, setuser, selected, curuser, setSelected,
    setmessages, setcuruser, theme, toggleTheme
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
// console.log(curuser)
  return (
    <div className={`Container ${theme}`}>
      <header className="mainheader">
        <div className="container-fluid py-2 px-4 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Avatar src="logo.webp" alt="Logo" height="40" className="me-3" />
            <h3 className="mb-0">ChatApp</h3>
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
            
            <Avatar className='logoutImg' src="logout.webp" alt="User" onClick={logout} style={{ cursor: 'pointer' }}/>
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

      {width > 800 && (
        <div className="mainChat">
          <div className="chatlist1">
            <MessageBox openGroupModal={() => setShowGroupModal(true)} openFriendModal={()=>setShowFriendModal(true)} />
          </div>
          <MessagePage dis={0} />
          <Description />
        </div>
      )}

      {width <= 800 && (
        <div className="mainChat2">
          <div className="chatlist3">
            {selected || selectedGroup
              ? <MessagePage dis={1} />
              : <MessageBox openGroupModal={() => setShowGroupModal(true)} openFriendModal={()=>setShowFriendModal(true)} />}
          </div>
        </div>
      )}

      {showGroupModal && <GroupModal closeModal={() => setShowGroupModal(false)} />}
      {showfriendModal && <FriendModal closeModal={()=>setShowFriendModal(false)}/>}
    </div>
  );
}

export default ChatPage;
