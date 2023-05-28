import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Dropdown from 'react-bootstrap/Dropdown'
import PromptButton from '../../../addon/PromptButton';


function Chapter({chapter: {id, title, description, completed, total}, onEditChapter, onDeleteChapter}) {
  
    const [isOpen, setIsOpen] = useState(false);

    const handleConfirmDelete = (confirmed) => {
      if (confirmed){
        onDeleteChapter(id);
      }
    };

    const handleOpenPrompt = (e) => {
        e.preventDefault();
        setIsOpen(true);
    };
      
      const handleClosePrompt = (e) => {
        e.preventDefault();
        setIsOpen(false);
    }

    return (
        <div key={id} className='chapter'>
            <PromptButton 
                message={"Are you sure you want to proceed?"}
                confirmText={"Confirm"}
                cancelText={"Cancel"}
                confirmAction={handleConfirmDelete}
                isOpen={isOpen}
                onClose={handleClosePrompt}
            />
            <div className='chapter-left-section'>
                <span>{title}</span>
                <p className='description'>{description}</p>
            </div>
            <div className='chapter-right-section'>
                <div className='complete-count'>
                    <span>
                    {completed}/{total}
                    </span>
                </div>
                <Dropdown align="start">
                    <Dropdown.Toggle className='dark-button'>
                        <FontAwesomeIcon icon="fa-solid fa-ellipsis" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className='dropdown-link'>
                        <Dropdown.Item onClick={() => onEditChapter(id)}><FontAwesomeIcon icon="fa-solid fa-pen" />Edit Chapter</Dropdown.Item>   

                        <Dropdown.Divider />

                        <Dropdown.Item onClick={handleOpenPrompt} className='danger-option'><FontAwesomeIcon icon="fa-solid fa-trash" />Remove Chapter</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    );
  }
  
  export default Chapter;