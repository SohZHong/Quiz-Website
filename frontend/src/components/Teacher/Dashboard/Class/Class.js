import React, {useState} from 'react';
import moment from 'moment';
import PromptButton from '../../../addon/PromptButton';

function Class({class:{id, name, code, created}, onVisitClass, onDeleteClass}) {

  const [isOpen, setIsOpen] = useState(false);

  const handleConfirmDelete = (confirmed) => {
    if (confirmed){
      onDeleteClass(id);
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
        <td>{convertDate(created)}</td>
        <td>{code}</td>
        <td><button className='blue-button' onClick={() => onVisitClass(id)}>View Class</button></td> 
        <td><button className='red-button' onClick={handleOpenPrompt} style={{float: 'right'}}>Delete Class</button></td>
    </tr>
  )
}


export default Class