import React, { useState, useCallback } from 'react';
import './StudentDashboard.scss';
import ClassList from './Class/ClassList';
import JoinClassModal from '../JoinClassModal/JoinClassModal';
import { useNavigate } from 'react-router-dom';

function StudentDashboard({ user: {id, name, profile} }) {
    const [classes, setClasses] = useState(0);
    const [completedClasses, setCompletedClasses] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    //Wrapped in callback to only create this function once and not rerender everytime
    const getClasses = useCallback(classes => {

        //Resetting state for incrementing
        setClasses(0);
        setCompletedClasses(0);

        //Get previous state to remain immutable
        classes.forEach((classObj) => {
            setClasses(prevState => prevState + 1);

            if (classObj.completion === "100"){
                setCompletedClasses(prevState => prevState + 1);
            }
        })
    }, []);

    const handleOpenModal = (e) => {
        e.preventDefault()
        setIsOpen(true)
    }

    const handleCloseModal = (e) => {
        e.preventDefault()
        setIsOpen(false)
    }

    const handleSettings = (e) => {
        e.preventDefault();
        navigate(`/student/${id}/settings`);
    }
    
    const profilePicture = profile == null ? 'no_pic.png' : profile;

    return(
        <React.Fragment>
            <JoinClassModal 
                studentID={id}
                isOpen={isOpen} 
                onClose={handleCloseModal} 
            /> 
            <section className='Container'>
                <h1 className='title'>Dashboard</h1>
                <div className='student-profile-container'>
                    <div className='student-wrapper'>
                        <img alt='profile_picture' src={require('../../../images/user_profiles/' + profilePicture)} />
                        <div className='student-details'>
                            <h2 >{name}</h2>
                            <button className='edit-button' onClick={handleSettings}>Edit Profile</button>
                        </div>
                    </div>
                    <div className='student-details-wrapper'>
                        <div className='joined-total'>
                            <h4>Classes Joined: </h4>
                            <h1>{classes}</h1>
                        </div>
                        <div className='complete-total'>
                            <h4>Classes Completed: </h4>
                            <h1>{completedClasses}</h1>
                        </div>
                    </div>
                </div>
                <div className='student-class-container'>
                    <div className='class-header-wrapper'>
                        <h1>Your Classes</h1>
                        <button className='join-button' onClick={handleOpenModal}>Join Class</button>
                    </div>
                    <ClassList studentID={id} getClasses={getClasses}/>
                </div>
            </section>
        </React.Fragment>

    )
}

export default StudentDashboard