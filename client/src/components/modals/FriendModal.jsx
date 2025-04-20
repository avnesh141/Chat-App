import React, { useState, useContext } from 'react';
import userContext from '../../contexts/users/UserContext';
import './GroupModal.css'; // You can rename this later if needed

function FriendModal({ closeModal }) {
  const { users, curId, addFriend } = useContext(userContext);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleAddFriend = () => {
    if (!selectedFriend) return alert('Please select a user to add as a friend.');
    addFriend(selectedFriend);
    closeModal();
  };

  return (
    <div className="group-modal">
      <div className="modal-content text-center"  style={{"backgroundColor":"teal","borderRadius":"10px","padding":"10px"}}>
        <h4 className="mb-3">Add a Friend</h4>

        <div className="user-list">
          {users?.filter((u) => u._id !== curId)?.map((user) => (
            <div key={user._id} className="form-check">
              <input
                type="radio"
                name="friend"
                className="form-check-input"
                checked={selectedFriend === user._id}
                onChange={() => setSelectedFriend(user._id)}
              />
              <label className="form-check-label ms-2">{user.name}</label>
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-end mt-3 gap-2">
          <button className="btn btn-success" onClick={handleAddFriend}>Add</button>
          <button className="btn btn-outline-secondary" onClick={closeModal}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default FriendModal;
