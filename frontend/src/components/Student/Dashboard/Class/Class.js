import React, { useState } from 'react'
import moment from 'moment';
import PromptButton from '../../../addon/PromptButton';

function Class({class:{id, name, joined, completion}, onVisitClass, onLeaveClass}) {

  const [isOpen, setIsOpen] = useState(false);

  const handleConfirmDelete = (confirmed) => {
    if (confirmed){
      onLeaveClass(id);
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

  const convertDate = (value) => {
    const date = new Date(value);
    return moment(date).format('YYYY-MM-DD');
  }

  return (
    <tr key={id}>
        <PromptButton 
          message={"Are you sure you want to proceed?"}
          confirmText={"Confirm"}
          cancelText={"Cancel"}
          confirmAction={handleConfirmDelete}
          isOpen={isOpen}
          onClose={handleClosePrompt}
        />
        <td>{name}</td>
        <td>{convertDate(joined)}</td>
        <td>{completion}%</td>
        <td><button className='blue-button' onClick={() => onVisitClass(id)}>View Class</button></td> 
        <td><button className='red-button' onClick={handleOpenPrompt} style={{float: 'right'}} >Leave Class</button></td>
    </tr>
  )
}


export default Class