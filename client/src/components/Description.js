import React, { useContext } from 'react';
import './Description.css';
import userContext from '../contexts/users/UserContext';

function Description() {
  const { user, selectedGroup, groupChat } = useContext(userContext);

  return (
    <div className="DetailsBox d-flex flex-column align-items-center justify-content-center w-100 h-100 p-3">
      <h3 className="desHead mb-3">Info</h3>

      {selectedGroup && groupChat ? (
        <>
          <img
            src="/group.png"
            alt="Group"
            className="desImg mb-3"
          />
          <h4 className="detailsItem mb-2 text-center">Group Name: {groupChat.name}</h4>
          <p className="text-muted">Group ID: {selectedGroup}</p>
        </>
      ) : user ? (
        <>
          <img
            src={user.picture || '/default-avatar.png'}
            alt="User"
            className="desImg mb-3"
          />
          <h4 className="detailsItem mb-2 text-center">Name: {user.name}</h4>
          <h5 className="detailsItem mb-2 text-center">Phone: {user.number}</h5>
          <h5 className="detailsItem mb-2 text-center">Email: {user.email}</h5>
        </>
      ) : (
        <p className="text-muted text-center">Details of the selected user or group will appear here.</p>
      )}
    </div>
  );
}

export default Description;