import React from "react";

function SuccessPopup({ message, onClose }) {
  if (!message) {
    return null;
  }

  return (
    <div className="popup-backdrop" onClick={onClose}>
      <div
        className="popup-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h4 id="popup-title" className="popup-title">Success</h4>
        <p className="popup-message">{message}</p>
        <button type="button" className="btn btn-primary" onClick={onClose} autoFocus>
          OK
        </button>
      </div>
    </div>
  );
}

export default SuccessPopup;
