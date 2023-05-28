import React, { useEffect, useState } from 'react';
import './EditClassModal.scss'
import Modal from '../../../addon/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

function EditClassModal ({class: {id, name, description, code}, isOpen, onClose}) {

    const [classInfo, setClassInfo] = useState({});

    useEffect(() => {
        setClassInfo({
            id: id,
            name: name,
            description: description,
            code: code,
        })
    }, [id, name, description, code])

    const handleChange = (e) => {

        const { name, value} = e.target;

        const updatedInfo = name ? {...classInfo, [name] : value} : classInfo;

        setClassInfo(updatedInfo);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('/api/teacher/edit_class', {data: classInfo})
            .catch(err => console.error(err))

    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form className='edit-class-form' onSubmit={handleSubmit}>
                <div className='form-title'>
                    <FontAwesomeIcon icon="fa-solid fa-pen" />
                    <span>Edit Class</span>
                    <div className='form-description'>
                        Edit Your Class!
                    </div>
                </div>

                <hr className='form-separator'/>
                <div className='form-input'>
                    <label htmlFor="name">Edit Class Name</label>
                    <input type='text' name="name" defaultValue={name} maxLength={50} onChange={(e) => handleChange(e)} required/>
                </div>
                <div className='form-input'>
                    <label htmlFor="description">Edit Description (optional)</label>
                    <input name="description" type='text' defaultValue={description} maxLength={255} onChange={((e) => handleChange(e))} />
                </div>
                <div className='form-input'>
                    <label htmlFor="code">Class Code (Generated)</label>
                    <input type='text' name='code' disabled defaultValue={code} />
                </div>
                <button className='save-button'>Save</button>
            </form>
        </Modal>
    )
}

export default EditClassModal