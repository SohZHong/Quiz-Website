import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';

function Modal ({children, isOpen, onClose}) {

    const [isClosing, setIsClosing] = useState(false);
    
    useEffect(() => {
        if (!isOpen) {
            // Delay the hide modal before finishing animation
            const timeout = setTimeout(() => {
            setIsClosing(true);
            }, 300);
    
            return () => {
            clearTimeout(timeout);
            };
        } 
        else {
            setIsClosing(false);
        }
      }, [isOpen]);


    const handleClick = (e) => {
        setIsClosing(true);
    
        // Delay function call for animation to finish
        setTimeout(() => {
            onClose(e);
        }, 300);
    }

    const closing = isClosing ? 'closed' : '';

    return isOpen ? 
    ReactDOM.createPortal(
        <div className={`modal-overlay ${closing}`}  onClick={(e) => handleClick(e)}>
            <div className='modal-body' onClick={e => e.stopPropagation()}>
                <div className='close-button-wrapper'>
                    <button className='close-button' onClick={(e) => handleClick(e)}>X</button>
                </div>
                {children}
            </div>
        </div>,
        document.body
    )
    : null;
}

export default Modal