import React, { useContext } from 'react';
import './InfoPage.css';
import userContext from '../../contexts/users/UserContext';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
function Info() {

  const { user, selectedGroup, groupChat } = useContext(userContext);
  // console.log(groupChat)
  return (
    <div className="DetailsBox d-flex flex-column align-items-center justify-content-center w-100 h-100 p-3">
      <h3 className="desHead mb-3">Info</h3>
      {selectedGroup && groupChat ?
        (<>
          <img
            src="/group.webp"
            alt="Group"
            className="desImg mb-3"
          />
          <h4 className="detailsItem mb-2 text-center">Group Name: {groupChat.name}</h4>
          <p className="text-muted">Group ID: {selectedGroup}</p>
          <p className="text-muted">Created By: {groupChat.createdBy.name}</p>
          <p className="text-muted">Members:</p>
          <div>
          {groupChat.members.map((member) =>
          (
            <ListItemButton key={member._id} className="mb-2 align-items-start">
              <ListItemAvatar>
                <Avatar alt={member.name} src={member.picture} />
              </ListItemAvatar>
              <ListItemText primary={member.name} secondary={member.number} />
            </ListItemButton>
          ))}
          </div>
        </>
        ) : user ? (
          <>
            <Avatar
              src={user.picture || '/default-avatar.png'}
              alt={user.name}
              className="desImg mb-3"
            />
            <h4 className="detailsItem mb-2 text-center">Name: {user.name}</h4>
            <h5 className="detailsItem mb-2 text-center">Phone: {user.number}</h5>
            <h5 className="detailsItem mb-2 text-center">Email: {user.email}</h5>
          </>
        ) : (
          <p className="text-muted text-center">Details of the selected user or group will appear here.</p>
        )
      }
    </div>
  );
}
export default Info;