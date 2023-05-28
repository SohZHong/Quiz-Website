import React, { useState } from 'react';
import './CreateClassModal.scss'
import Modal from '../../addon/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateClassModal ({teacherID, isOpen, onClose}) {

    const navigate = useNavigate();

    const generateID = () => {
        let result = '';
        const availableChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const characterLength = availableChars.length;

        let counter = 0;
        //Generate a 8 character string 
        while (counter < 8){
            result += availableChars.charAt(Math.floor(Math.random() * characterLength));
            counter += 1;
        }

        return result
    }

    const [classInfo, setClassInfo] = useState({
        id: teacherID.toString(),
        name: '',
        description: '',
        code: generateID(),
    });

    const handleChange = (e) => {

        const { name, value} = e.target;

        const updatedInfo = name ? {...classInfo, [name] : value} : classInfo;

        setClassInfo(updatedInfo);

    }

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('/api/teacher/add_class', {data: classInfo})
            .then(resp => {
                navigate(`/teacher/${teacherID}/class/${resp.data[0]}`);
            })
            .catch(err => console.error(err))
        onClose(e)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form className='create-class-form' onSubmit={handleSubmit}>
                <div className='form-title'>
                    <FontAwesomeIcon icon="fa-solid fa-file-circle-plus" />
                    <span>Create Class</span>
                    <div className='form-description'>
                        Create A Class For Your Students to Join!
                    </div>
                </div>
                <hr className='form-separator'/>
                <div className='form-input'>
                    <label htmlFor="name">Enter Class Name</label>
                    <input type='text' name="name" maxLength={50} onChange={(e) => handleChange(e)} required/>
                </div>
                <div className='form-input'>
                    <label htmlFor="description">Enter Description (optional)</label>
                    <input name="description" type='text' maxLength={255} onChange={((e) => handleChange(e))} />
                </div>
                <div className='form-input'>
                    <label htmlFor="code">Class Code (Generated)</label>
                    <input type='text' name='code' disabled defaultValue={classInfo.code} />
                </div>
                <button className='save-button'>Save</button>
            </form>
        </Modal>
    )
}

export default CreateClassModal