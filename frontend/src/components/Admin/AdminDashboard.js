import React, { useState, useCallback, useEffect } from 'react';
import './AdminDashboard.scss';
import UserList from './Users/UserList'
import FeedbackList from './Feedbacks/FeedbackList';
import axios from 'axios';

function AdminDashboard({ user }) {

    const [students, setStudents] = useState(0);
    const [teachers, setTeachers] = useState(0);
    const [admins, setAdmins] = useState(0);
    const [classes, setClasses] = useState(0);
    const [feedbacks, setFeedbacks] = useState(0);

    //Future create function to get class count
    useEffect(() => {
        axios.get("/api/admin/get_class")
        .then(resp => setClasses(parseInt(resp.data)))
        .catch(err => console.error(err))
    }, [])

    //Wrapped in callback to only create this function once and not rerender everytime
    const getUsers = useCallback(users => {

        //Resetting state for incrementing
        setStudents(0);
        setTeachers(0);
        setAdmins(1); //1 to account for current active admin

        //Separate teacher and student accounts
        //Get previous state to remain immutable
        users.forEach(user => {
            let type = user.type;

            type === "Student" ? setStudents(prevState => prevState + 1)
            : type === "Teacher" ? setTeachers(prevState => prevState + 1)
            : setAdmins(prevState => prevState + 1)

        })
    }, []);

    
    const getFeedbacks = useCallback(feedbacks => {

        //Resetting state for incrementing
        setFeedbacks(0);

        //Separate teacher and student accounts
        //Get previous state to remain immutable
        feedbacks.forEach(() => 
            setFeedbacks(prevState => prevState + 1)
        )
    }, []);

    return(
    <section className='Container'>
        <h1 className='title'>Dashboard</h1>
        <div className='content'>
            <div className='statistics-container'>
                <div className='teacher-total'>
                    <h4>Total Teachers</h4>
                    <h1>{teachers}</h1>
                </div>
                <div className='student-total'>
                    <h4>Total Students</h4>
                    <h1>{students}</h1>
                </div>
                <div className='admin-total'>
                    <h4>Total Admins</h4>
                    <h1>{admins}</h1>
                </div>
                <div className='class-total'>
                    <h4>Total Classes Created</h4>
                    <h1>{classes}</h1>
                </div>
                <div className='class-total'>
                    <h4>Total Feedbacks</h4>
                    <h1>{feedbacks}</h1>
                </div>
            </div>
            <UserList getUsers={getUsers} user={user} />
            <FeedbackList getFeedbacks={getFeedbacks} user={user} />
        </div>
    </section>
    )
}

export default AdminDashboard