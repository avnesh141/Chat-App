import React, { useContext, useEffect, useRef } from 'react';
import userContext from '../../contexts/users/UserContext';

const IncomingCallModal = () => {
  const ringtoneRef = useRef();
  const timeoutRef = useRef();

const { callerName, onAccept, onReject ,offer} = useContext(userContext);
  // userContext

  useEffect(() => {
    const audio = ringtoneRef.current;
    
    const playRingtone = async () => {
      try {
        audio.volume = 0.5; // Lower volume to be less intrusive
        await audio.play();
      } catch (err) {
        console.error("Couldn't play ringtone:", err);
      }
    };

    playRingtone();
    
    timeoutRef.current = setTimeout(() => {
      onReject();
    }, 30000); // Auto-reject after 30s

    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      clearTimeout(timeoutRef.current);
    };
  }, [onReject]);

  const handleAccept = () => {
    ringtoneRef.current.pause();
    ringtoneRef.current.currentTime = 0;
    clearTimeout(timeoutRef.current);
    onAccept(offer);
  };

  const handleReject = () => {
    ringtoneRef.current.pause();
    ringtoneRef.current.currentTime = 0;
    clearTimeout(timeoutRef.current);
    onReject();
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0,
      width: "100vw", height: "100vh",
      backgroundColor: "rgba(0,0,0,0.6)",
      display: "flex", justifyContent: "center", alignItems: "center",
      zIndex: 9999
    }}>
      <div style={{
        background: "#fff", padding: "2rem",
        borderRadius: "1rem", boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        textAlign: "center", minWidth: "300px"
      }}>
        <h3>📞 Incoming Video Call</h3>
        <p>{callerName} is calling...</p>
        <audio src="/ringtone.mp3" loop style={{ display: "none" }} ref={ringtoneRef}/>
        <div style={{ marginTop: "1.5rem" }}>
          <button 
            onClick={handleAccept} 
            style={{ 
              marginRight: 10,
              padding: "0.5rem 1.5rem",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Accept
          </button>
          <button 
            onClick={handleReject}
            style={{
              padding: "0.5rem 1.5rem",
              background: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;