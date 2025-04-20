import React, { useState } from 'react';

const ChatFilePreview = ({ fileUrl }) => {
  const [showModal, setShowModal] = useState(false);
  const ext = fileUrl.split('.').pop().toLowerCase();

  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
  const isVideo = ['mp4', 'webm'].includes(ext);
  const isPDF = ext === 'pdf';

  return (
    <div>
      {/* Preview Block */}
      {isImage && (
        <img
          src={fileUrl}
          alt="file"
          onClick={() => setShowModal(true)}
          style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '10px', cursor: 'pointer' }}
        />
      )}

      {isVideo && (
        <video
          src={fileUrl}
          controls
          style={{ maxWidth: '180px', maxHeight: '180px', borderRadius: '10px' }}
        />
      )}

      {isPDF && (
        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
          📄 View PDF
        </a>
      )}

      {!isImage && !isVideo && !isPDF && (
        <a href={fileUrl} download>
          📎 Download File
        </a>
      )}

      {/* Download Button */}
      <div style={{ marginTop: '4px' }}>
        <a href={fileUrl} download className="text-sm text-blue-600 underline">
          ⬇️ Download
        </a>
      </div>

      {/* Modal for full-screen image */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <img
            src={fileUrl}
            alt="preview"
            style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: '8px' }}
          />
        </div>
      )}
    </div>
  );
};

export default ChatFilePreview;
