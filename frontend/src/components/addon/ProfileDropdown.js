import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Dropdown from 'react-bootstrap/Dropdown'
import JoinClassModal from '../Student/JoinClassModal/JoinClassModal';
import CreateClassModal from '../Teacher/CreateClassModal/CreateClassModal';
import { useNavigate } from 'react-router-dom'

//Later need add verification check student or teacher
function ProfileDropdown( {id, name, accountType, handleLogout} ) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenModal = (e) => {
    e.preventDefault()
    setIsModalOpen(true)
  }

  const handleCloseModal = (e) => {
      e.preventDefault()
      setIsModalOpen(false)
  }

  const handleHome = (e) => {
    e.preventDefault();
    navigate(`/${accountType.toLowerCase()}/${id}`)
  }

  const handleProfile = (e) => {
    e.preventDefault();
    navigate(`${accountType.toLowerCase()}/${id}/profile`)
  }

  const handleSettings = (e) => {
    e.preventDefault();
    navigate(`${accountType.toLowerCase()}/${id}/settings`);
  }

  const handleFeedback = (e) => {
    e.preventDefault();
    navigate("/support");
  }

  const handleTOS = (e) => {
    e.preventDefault();
    navigate("/t&c");

  }

  const handlePolicy = (e) => {
    e.preventDefault();
    navigate("/policy");

  }

  return (
    <React.Fragment>
        <Dropdown>
            <Dropdown.Toggle>
                {name}
            </Dropdown.Toggle>
            <Dropdown.Menu className='dropdown-link'>

            <Dropdown.Item onClick={handleHome}><FontAwesomeIcon icon="fa-solid fa-house" />Dashboard</Dropdown.Item>

            {accountType === 'Student' ? (
              <React.Fragment>
                <JoinClassModal 
                  studentID={id}
                  isOpen={isModalOpen} 
                  onClose={handleCloseModal} 
                /> 
                <Dropdown.Item onClick={handleOpenModal}><FontAwesomeIcon icon="fa-solid fa-arrow-right-to-bracket" />Join Class</Dropdown.Item>
              </React.Fragment>
              
            ) : accountType === 'Teacher' ? (
              <React.Fragment>
                <CreateClassModal  
                    teacherID={id} 
                    isOpen={isModalOpen} 
                    onClose={handleCloseModal} 
                />
                <Dropdown.Item onClick={handleOpenModal}><FontAwesomeIcon icon="fa-solid fa-file-circle-plus" />Create Class</Dropdown.Item>
              </React.Fragment>
              
            ) : null}
            
            <Dropdown.Divider />
            
            <Dropdown.Item onClick={handleProfile}><FontAwesomeIcon icon="fa-solid fa-circle-user" />Personal Information</Dropdown.Item>
            <Dropdown.Item onClick={handleSettings}><FontAwesomeIcon icon="fa-solid fa-gear" />Settings</Dropdown.Item>

            <Dropdown.Divider />

            <Dropdown.Item onClick={handleFeedback}><FontAwesomeIcon icon="fa-solid fa-message" />Send Feedback</Dropdown.Item>
            <Dropdown.Item onClick={handleTOS}><FontAwesomeIcon icon="fa-solid fa-file" />Terms of Service</Dropdown.Item>
            <Dropdown.Item onClick={handlePolicy}><FontAwesomeIcon icon="fa-solid fa-shield" />Privacy Policy</Dropdown.Item>

            <Dropdown.Divider />

            <Dropdown.Item className='danger-option' onClick={(e) => handleLogout(e, navigate)}><FontAwesomeIcon icon="fa-solid fa-power-off" />Logout</Dropdown.Item>
            </Dropdown.Menu>

        </Dropdown>
    </React.Fragment>

  )
}

export default ProfileDropdown