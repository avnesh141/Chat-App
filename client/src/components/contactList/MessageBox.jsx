import React, { useContext, useState } from 'react';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import './MessageBox.css';
import userContext from '../../contexts/users/UserContext';
import { useNavigate } from 'react-router-dom';

function MessageBox({ openGroupModal, openFriendModal }) {
  const {
    onlineUsers, selected, setSelected,
    friends, curId, groups, messages,
    setGroupChat, setSelectedGroup,
    selectedGroup, getChatId, theme,selectedChat,
    setSetSelectedChat
  } = useContext(userContext);

  const navigate = useNavigate();
  const [chatId, setChatId] = useState(null);
  const handleGroupClick = (group) => {
    setSelected(null);
    setSelectedGroup(group._id);
    setGroupChat(group);
    setChatId(selectedGroup);
  };

  const handleUserClick = (friend) => {
    setSelectedGroup(null);
    setSelected(friend._id);
    setSetSelectedChat(friend);
    setChatId(getChatId(curId, selected));
  };



  const getLastMessage = (userId) => {
    const thisChat= getChatId(curId,userId);
    if(!messages || !messages[thisChat])return "";
    const reversed = [...messages[thisChat]].reverse();
    return reversed[0]?.message;
  };

  return (
    <div className={`msgBx ${theme}`}>
      <Paper square elevation={1} className="p-3" style={{ "height": "100%" }} >
        <div className="d-flex justify-content-between align-items-center mb-3 messageBoxHead">
          <h4 className="mb-0">Inbox</h4>
          <div>
            <button className="btn btn-sm btn-outline-primary mx-1" onClick={openGroupModal}>
              + Group
            </button>
            <button className="btn btn-sm btn-outline-primary mx-1" onClick={openFriendModal}>
              + Friend
            </button>
          </div>
        </div>

        <List className='userList'>
          {groups?.length > 0 && (
              <React.Fragment key="groups-section">
              <p className="text-muted fw-bold px-3">Groups</p>
              {groups?.map(group => (
                // <div
                //   key={group._id}
                //   className={`entity-row group-row ${selectedGroup === group._id ? 'bg-info bg-opacity-25' : ''}`}
                //   onClick={() => handleGroupClick(group)}
                // >
                  <ListItemButton
                   key={group._id}
                   className={`entity-row group-row ${selectedGroup === group._id ? 'bg-info bg-opacity-25' : ''}`}
                   onClick={() => handleGroupClick(group)}
                  >
                    <ListItemAvatar>
                      <Avatar alt="Group" src="/group.webp" />
                    </ListItemAvatar>
                    <ListItemText primary={group.name} secondary="Group Chat" />
                  </ListItemButton>
                // </div>
              ))}
             </React.Fragment>
          )}

          {friends?.length > 0 && (
            <React.Fragment key="friends-section">
              <p className="text-muted fw-bold px-3 mt-3">Contacts</p>
              {friends?.map((friend) => (
                // <div
                //   key={_id}
                //   className={`entity-row ${selected === _id ? 'bg-warning bg-opacity-25' : ''}`}
                //   onClick={() => handleUserClick(_id)}
                // >
                  <ListItemButton
                  key={friend._id}
                  className={`entity-row ${selected === friend._id ? 'bg-warning bg-opacity-25' : ''}`}
                  onClick={() => handleUserClick(friend)}
                  >
                    <ListItemAvatar>
                      {onlineUsers?.includes(friend._id) && (
                        <span className="badge bg-success position-absolute translate-middle p-1 rounded-circle">
                          <span className="visually-hidden">Online</span>
                        </span>
                      )}
                      <Avatar alt={friend.name} src={friend.picture || '/user.webp'} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={friend._id === curId ? `${friend.name} (You)` : friend.name}
                      secondary={getLastMessage(friend._id)}
                    />
                  </ListItemButton>
                // </div>
              ))}
             </React.Fragment>
          )}
        </List>
      </Paper>
    </div>
  );
}

export default MessageBox;
