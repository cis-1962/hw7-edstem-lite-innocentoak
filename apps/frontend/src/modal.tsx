import React from 'react';

function Modal({ children, onClose }) {
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <button onClick={onClose} className="modal-close-button">&times;</button>
                {children}
            </div>
        </div>
    );
}

export default Modal;
