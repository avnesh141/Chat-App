import React, { useContext, useState } from 'react';
import ReactPlayer from 'react-player';
import './VideoCallModal.css';
import userContext from '../../../contexts/users/UserContext';

const VideoCallModal = () => {
  // if (!isOpen) return null;
  const {
    myStream,
    remoteStream,
    sendStreams,
    handleCallUser,
    isCalling,
    isInCall,
    setShowCall,
    onEndCall,isCallee
  } = useContext(userContext);
  
  const [startCall,setStartCall]=useState(true);
  const [sendStreamButton,setSendStreamButton]=useState(true);
  return (
    <div className="video-call-modal-overlay">
      <div className="video-call-modal">
        <div className="modal-header">
          <h2>Video Call</h2>
          <button className="close-button" onClick={()=>{
            setShowCall(false);
          }}>×</button>
        </div>

        <div className="video-container">
          {/* Remote Video */}
          <div className="video-box remote-video">
            {remoteStream ? (
              <ReactPlayer
                url={remoteStream}
                playing
                playsinline
                width="100%"
                height="100%"
                config={{
                  file: {
                    attributes: {
                      autoPlay: true,
                      muted: false
                    }
                  }
                }}
              />
            ) : (
              <div className="no-video">
                {isInCall ? 'Waiting for remote stream...' : 'Remote video will appear here'}
              </div>
            )}
            <div className="video-label">Remote</div>
          </div>

          {/* Local Video */}
          <div className="video-box local-video">
            {myStream ? (
              <ReactPlayer
                url={myStream}
                playing
                playsinline
                muted
                width="100%"
                height="100%"
                config={{
                  file: {
                    attributes: {
                      autoPlay: true,
                      muted: true
                    }
                  }
                }}
              />
            ) : (
              <div className="no-video">Local video not available</div>
            )}
            <div className="video-label">You</div>
          </div>
        </div>

        <div className="call-controls">
          {!isCallee  && (
            <button
            disabled={!startCall}
              className="control-button call-button"
              onClick={()=>{
                handleCallUser();
                setStartCall(false);
              }}
            >
              Start Call
            </button>
          )}

         {
          isCallee && 
          <button
          disabled={!sendStreamButton}
          className="control-button call-button"
          onClick={()=>{
            sendStreams();
            setSendStreamButton(false);
          }}
          
        >
          Share Your Video
        </button>
         }
          {isCalling && !isInCall && (
            <button
              className="control-button calling-button"
              disabled
            >
              Calling...
            </button>
          )}
           <button
              className="control-button call-button"
              onClick={()=>{
                setShowCall(false);
              }}
            >
              End Call
            </button>
          
          {isInCall && (
            <>
              <button
                className="control-button end-call-button"
                onClick={onEndCall}
              >
                End Call
              </button>

              <button
                className="control-button send-stream-button"
                onClick={sendStreams}
              >
                Send Stream
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;