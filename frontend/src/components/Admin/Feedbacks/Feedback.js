import React from 'react'
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Feedback({feedback:{id, title, name, email, content, posted, read}, onClickFeedback, onDeleteFeedback}) {

  const isRead = {
    fontWeight: read==='0' ? 'bold' : 'normal'
  }

  const convertDate = (value) => {
    const date = new Date(value);
    return moment(date).format('DD/MM/YYYY');
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Stop event propagation to prevent triggering onClickFeedback
    onDeleteFeedback(id);
  };

  return (
    <details style={isRead} onClick={() =>  onClickFeedback(id)}>
      <summary>
      <div className='row-header'>
        <span >{title}</span>
        <span >{convertDate(posted)}</span>
        <span >{read === '1' ? "Read" : "Pending"}</span>
      </div>
      </summary>
      <div className='details-content'>
        <div className='details-header'>
          <span>Posted by: {name}</span>
          <span>[{email}]</span>
          <span style={{cursor: 'pointer'}} onClick={handleDeleteClick}><FontAwesomeIcon icon="fa-solid fa-trash" /></span>
        </div>
        <br/><br/>
        <h4>Context:</h4>
        <hr/>
        <p>{content}</p>
      </div>
    </details>
  )
}


export default Feedback