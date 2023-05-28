import React, { useState, useCallback } from 'react';
import './TeacherDashboard.scss';
import ClassList from './Class/ClassList';
import { useNavigate } from 'react-router-dom';
import CreateClassModal from '../CreateClassModal/CreateClassModal';

function TeacherDashboard({ user:{id, name, profile} }) {
    const [classes, setClasses] = useState(0);
    const [students, setStudents] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    //Wrapped in callback to only create this function once and not rerender everytime
    const getClasses = useCallback(classes => {

        const { numClasses, numStudents } = classes.reduce(
            (acc, curr) => {
              acc.numClasses++; //increment by 1 for every class looped
              acc.numStudents += curr.count; //increment based on student_count
              return acc;
            },
            { numClasses: 0, numStudents: 0 } //initial state
          );
          setClasses(numClasses);
          setStudents(numStudents);
          
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
        navigate(`/teacher/${id}/settings`);
    }

    const profile_picture = profile == null ? 'no_pic.png' : profile;

    return(
    <React.Fragment>
    <CreateClassModal  
        teacherID={id} 
        isOpen={isOpen} 
        onClose={handleCloseModal} 
    />
    <section className='Container'>
        <h1 className='title'>Dashboard</h1>
        <div className='teacher-profile-container'>
            <div className='teacher-wrapper'>
                <img alt='profile_picture' src={require('../../../images/user_profiles/' + profile_picture)} />
                <div className='teacher-details'>
                    <h2>{name}</h2>
                    <button className='edit-button' onClick={handleSettings}>Edit Profile</button>
                </div>
            </div>
            <div className='teacher-details-wrapper'>
                <div className='created-total'>
                    <h4>Classes Created: </h4>
                    <h1>{classes}</h1>
                </div>
                <div className='student-total'>
                    <h4>Total Students: </h4>
                    <h1>{students}</h1>
                </div>
            </div>
        </div>
        <div className='teacher-class-container'>
            <div className='class-header-wrapper'>
                <h1>Your Classes</h1>
                <button className='create-button' onClick={handleOpenModal}>Create Class</button>
            </div>

            <ClassList teacherID={id} getClasses={getClasses}/>
        </div>
    </section>
    </React.Fragment>
    )
}

export default TeacherDashboard