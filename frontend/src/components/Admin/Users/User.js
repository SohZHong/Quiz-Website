import React, { useState } from 'react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PromptButton from '../../addon/PromptButton';

function User({user:{id, name, password, email, type, registration, status}, onEditTable, onDisableUser, onDeleteUser}) {

  const [editStatus, setEditable] = useState(false);
  const [activeStatus, setActive] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const handleEdit = (e) => {
    e.preventDefault();
    setEditable(prevState => !prevState);
  };

  const handleDisable = (e, id) => {
    e.preventDefault();
    onDisableUser(id);
    setActive(prevState => !prevState);
  };

  const handleConfirmDelete = (confirmed) => {
    if (confirmed){
      onDeleteUser(id);
    }
  };

  const handleOpenPrompt = (e) => {
    e.preventDefault();
    setIsOpen(true);
  }

  const handleClosePrompt = (e) => {
    e.preventDefault();
    setIsOpen(false);
  }

  const convertDate = (value) => {
    const date = new Date(value);
    return moment(date).format('YYYY-MM-DD');
  };

  const edit = editStatus ? "editing" : ""
  const disable = status === '0' ? "disable" : ""

  const rowStyles = `${edit} ${disable}`;

  return (
    <tr key={id} className={rowStyles}>
        <td>
          <input
            required
            name="name"
            value={name}
            type='text'
            onChange={(e) => onEditTable(e, id)}
            disabled = {!editStatus}
          />
        </td>
        <td>
          <input
              required
              name="password"
              value={password}
              type={editStatus ? "text" : "password"}
              onChange={(e) => onEditTable(e, id)}
              disabled = {!editStatus}
            />
        </td>
        <td>
          <input
              required
              name="email"
              value={email}
              type='email'
              onChange={(e) => onEditTable(e, id)}
              disabled = {!editStatus}
            />
        </td>
        <td>
          <input
              name="type"
              value={type}
              type='text'
              disabled = {true}
            />
        </td>
        <td>
          <input
              name="registration"
              value={convertDate(registration)}
              type='date'
              disabled = {true}
            />
        </td>
        <td>
          <div className='table-buttons'>
            <PromptButton 
              message={"Are you sure you want to proceed?"}
              confirmText={"Confirm"}
              cancelText={"Cancel"}
              confirmAction={handleConfirmDelete}
              isOpen={isOpen}
              onClose={handleClosePrompt}
            />
            <button className='edit-button' onClick={(e) => handleEdit(e)}><FontAwesomeIcon icon="fa-solid fa-pen" /></button>
            <button className='disable-button' onClick={(e) => handleDisable(e, id)}>
              {activeStatus ? <FontAwesomeIcon icon="fa-solid fa-unlock" /> : <FontAwesomeIcon icon="fa-solid fa-lock" />}
            </button>
            <button className='delete-button' onClick={handleOpenPrompt}><FontAwesomeIcon icon="fa-solid fa-trash" /></button>
          </div>
        </td>
    </tr>
  )
}


export default User