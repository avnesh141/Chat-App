// export default GroupModal;

import React, { useState, useContext } from 'react';
import userContext from '../contexts/users/UserContext';
import './GroupModal.css';

function GroupModal({ closeModal }) {
  const { users, curId, createGroup } = useContext(userContext);
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return alert("Group name cannot be empty.");
    if (!selectedUsers.length) return alert("Please select at least one user.");

    try {
      console.log("djdj");
      await createGroup(groupName, selectedUsers);
      closeModal();
    } catch (err) {
      console.error("Group creation failed:", err);
    }
  };

  const toggleUser = (user) => {
    setSelectedUsers((prev) =>
      prev.includes(user) ? prev.filter((p_user) => p_user !== user ) : [...prev, user]
    );
  };

  return (
    <div className="group-modal">
      <div className="modal-content text-center" style={{"backgroundColor":"teal","borderRadius":"10px","padding":"10px"}}>  
        <h4 className="mb-3">Create a Group</h4>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Enter group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        <div className="user-list">
          {users.filter((u) => u._id !== curId).map((user) => (
            <div key={user._id} className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={selectedUsers.includes(user)}
                onChange={() => toggleUser(user)}
              />
              <label className="form-check-label ms-2">{user.name}</label>
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-end mt-3 gap-2">
          <button className="btn btn-success" onClick={handleCreateGroup}>Create</button>
          <button className="btn btn-outline-secondary" onClick={closeModal}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default GroupModal;