import React, { useState } from 'react';
import './JoinClassModal.scss'
import Modal from '../../addon/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function JoinClassModal ({studentID, isOpen, onClose}) {

    const [classCode, setClassCode] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setClassCode(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const sendJoinRequest = async (class_id) => {
            await axios.post("/api/join_class", {data: {studentID: studentID, classID: class_id}})
            .catch(err => console.error(err))
        }

        axios.get(`/api/get_class_code/${studentID}/${classCode}`)
            .then(resp => {

                if (resp.data.classFound){

                    const classID = parseInt(resp.data.id);
                    sendJoinRequest(classID);
                    navigate(`/student/${studentID}/class/${classID}`);
                }
                else {
                    setShowErrorMessage(true) //Class Not Found Message
                }

            })
            .catch(err => console.error(err))

        
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form className='join-class-form' onSubmit={handleSubmit}>
                <div className='form-title'>
                    <FontAwesomeIcon icon="fa-solid fa-arrow-right-to-bracket" />
                    <span>Join Class</span>
                    <div className='form-description'>
                        Join Your Peers In An Exciting And Engaging Learning Experience!
                    </div>
                </div>
                <hr className='form-separator'/>
                <div className='form-input'>
                    <label htmlFor="class-code">Enter Class Code</label>
                    <input type='text' name="class-code" maxLength={8} onChange={(e) => handleChange(e)}/>
                </div>
                <div className='not-found_message' style={{visibility: showErrorMessage ? 'visible' : 'hidden'}}>
                    Class Not Found!
                </div>
                <button className='join-button'>Join</button>
            </form>
        </Modal>
    )
}

export default JoinClassModal