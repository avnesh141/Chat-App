import React, { useContext, useState } from 'react'
import MessageBox from "./MessageBox";
import MessagePage from "./MessagePage";
import Description from "./Description";
import FriendModal from "./FriendModal";
import GroupModal from "./GroupModal";
import userContext from '../contexts/users/UserContext';
import './Chatpage.css';


function SecondaryChatPage() {
    const { selected, selectedGroup } = useContext(userContext);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [showfriendModal, setShowFriendModal] = useState(false);
    return (
        <div>
            <div className="mainChat" >
                <div className="chatlist1">
                    <MessageBox openGroupModal={() => setShowGroupModal(true)} openFriendModal={() => setShowFriendModal(true)} />
                </div>
                <MessagePage dis={0} />
                <Description />
            </div>

            <div className="mainChat2">
                <div className="chatlist3">
                    {selected || selectedGroup
                        ? <MessagePage dis={1} />
                        : <MessageBox openGroupModal={() => setShowGroupModal(true)} openFriendModal={() => setShowFriendModal(true)} />}
                </div>
            </div>

            {showGroupModal && <GroupModal closeModal={() => setShowGroupModal(false)} />}
            {showfriendModal && <FriendModal closeModal={() => setShowFriendModal(false)} />}
        </div>
    )
}

export default SecondaryChatPage