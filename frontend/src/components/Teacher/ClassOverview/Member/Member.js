import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Dropdown from 'react-bootstrap/Dropdown';
import PromptButton from '../../../addon/PromptButton';

const Member = ({member:{ id, name, profile }, onClickMember, onDeleteMember}) => {

    const [isOpen, setIsOpen] = useState(false);

    const handleConfirmDelete = (confirmed) => {
      if (confirmed){
        onDeleteMember(id);
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

    const profile_picture = profile == null ? 'no_pic.png' : profile

    return (
        <div key={id} className='member'>
            <PromptButton 
                message={"Are you sure you want to proceed?"}
                confirmText={"Confirm"}
                cancelText={"Cancel"}
                confirmAction={handleConfirmDelete}
                isOpen={isOpen}
                onClose={handleClosePrompt}
            />
            <div className='member-details'>
                <img alt='User_Profile' className='user-profile' src={require('../../../../images/user_profiles/' + profile_picture)}/>
                <span>{name}</span>
            </div>
            <Dropdown align="start">
                <Dropdown.Toggle className='dark-button'>
                    <FontAwesomeIcon icon="fa-solid fa-ellipsis" />
                </Dropdown.Toggle>
                <Dropdown.Menu className='dropdown-link'>
                    <Dropdown.Item onClick={(e) => onClickMember(e, id.toString())}><FontAwesomeIcon icon="fa-solid fa-circle-user" />View Profile</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item className='danger-option' onClick={handleOpenPrompt}><FontAwesomeIcon icon="fa-solid fa-trash" />Remove Member</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

export default Member;
