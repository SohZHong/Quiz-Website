import React from 'react';
import Modal from './Modal';

function PromptButton({message, confirmText, cancelText, confirmAction, isOpen, onClose}){
    
    const handleConfirmClick = (e) => {
        e.preventDefault();
        confirmAction(true);
        onClose(e);
    }

    return(
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="action-container">
                <h3 className="title">{message}</h3>
                <div className='button-container'>
                    <button className="confirmation-button" onClick={handleConfirmClick}>{confirmText}</button>
                    <button className="cancel-button" onClick={onClose}>{cancelText}</button>
                </div>
            </div>
        </Modal>
    )
}

export default PromptButton;
