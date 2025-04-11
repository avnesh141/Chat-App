import React, { useContext, useState } from 'react';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import './MessageBox.css';
import userContext from '../contexts/users/UserContext';

function MessageBox({ openGroupModal }) {
  const {
    onlineUsers, selected, setSelected,
    users, curId, groups, messages,
    setGroupChat, setSelectedGroup,
    selectedGroup
  } = useContext(userContext);


  const handleGroupClick = (group) => {
    setSelected(null);
    setSelectedGroup(group._id);
    setGroupChat(group);
  };

  const handleUserClick = (_id) => {
    setSelectedGroup(null);
    setSelected(_id);
  };

  

  const getLastMessage = (userId) => {
    const reversed = [...messages].reverse();
    const last = reversed.find(
      (m) => m.senderId === userId || m.receiverId === userId
    );
    return last ? last.message : '';
  };

  return (
    <div className="msgBx">
      <Paper square elevation={1} className="p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Inbox</h4>
          <button className="btn btn-sm btn-outline-primary" onClick={openGroupModal}>
            + Group
          </button>
        </div>

        <List>
          {groups?.length > 0 && (
            <>
              <p className="text-muted fw-bold px-3">Groups</p>
              {groups.map(group => (
                <div
                  key={group._id}
                  className={`entity-row group-row ${selectedGroup === group._id ? 'bg-info bg-opacity-25' : ''}`}
                  onClick={() => handleGroupClick(group)}
                >
                  <ListItemButton>
                    <ListItemAvatar>
                      <Avatar alt="Group" src="/group.png" />
                    </ListItemAvatar>
                    <ListItemText primary={group.name} secondary="Group Chat" />
                  </ListItemButton>
                </div>
              ))}
            </>
          )}

          {users?.length > 0 && (
            <>
              <p className="text-muted fw-bold px-3 mt-3">Users</p>
              {users.map(({ _id, name, email, picture }) => (
                <div
                  key={_id}
                  className={`entity-row ${selected === _id ? 'bg-warning bg-opacity-25' : ''}`}
                  onClick={() => handleUserClick(_id)}
                >
                  <ListItemButton>
                    <ListItemAvatar>
                      {onlineUsers.includes(_id) && (
                        <span className="badge bg-success position-absolute translate-middle p-1 rounded-circle">
                          <span className="visually-hidden">Online</span>
                        </span>
                      )}
                      <Avatar alt="Profile" src={picture || '/user.png'} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={_id === curId ? `${name} (You)` : name}
                      secondary={messages && getLastMessage(_id) || email}
                    />
                  </ListItemButton>
                </div>
              ))}
            </>
          )}
        </List>
      </Paper>
    </div>
  );
}

export default MessageBox;
