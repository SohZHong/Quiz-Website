import React, { useState } from 'react';
import './SignUp.scss';
// import Button from '../Login/Button.js';
import Input from '../../addon/Input';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUp(){

    const [registerForm, setRegisterForm] = useState({ username: '', password: '', email: '', type: ''});
    const [confirmationPassword, setConfirmationPassword] = useState('');
    const [isValidated, setIsValidated] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name !== 'cPassword'){
            const updatedData = {...registerForm, [name] : value};
            setRegisterForm(updatedData);
        }
        else {
            setConfirmationPassword(value)
            setIsValidated(value === registerForm.password);
        }
    }

    const handleSelect = (e) => {
        const value = e.target.value;

        const updatedData = {...registerForm, type: value};

        setRegisterForm(updatedData);
    }

    const handleNavigate = () => {
        navigate('/login')
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const sendPostRequest = async () => {
            await axios.post("/api/register", {data: registerForm});
        };
        sendPostRequest();

        //Go to Login page after registration
        handleNavigate();
    }

    return (
        <div className="container">
            <div className="mainbox">
                <img alt='Company_Logo'/>
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div id='userrole'>
                    <input type='radio' id='student' name='userRole' value='Student' onClick={handleSelect}></input>
                    <label htmlFor='student' className='student'><span>Student</span></label>
                    <input type='radio' id='teacher' name='userRole' value='Teacher' onClick={handleSelect} ></input>
                    <label htmlFor='teacher' className='teacher'><span>Teacher</span></label>
                    </div>
                    <Input 
                        label={"Username"}
                        type={"name"}
                        name={"username"}
                        placeholder={""}
                        required={true}
                        defaultValue={registerForm.username}
                        handleInput={handleChange}
                    />
                    <Input 
                        label={"Email"}
                        type={"email"}
                        name={"email"}
                        placeholder={""}
                        required={true}
                        defaultValue={registerForm.email}
                        handleInput={handleChange}
                    />
                    <Input 
                        label={"Password"}
                        type={"password"}
                        name={"password"}
                        pattern={"(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"}
                        title={"Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"}
                        placeholder={""}
                        required={true}
                        defaultValue={registerForm.password}
                        handleInput={handleChange}
                    />
                    <Input 
                        label={"Confirm Password"}
                        type={"password"}
                        name={"cPassword"}
                        placeholder={""}
                        required={true}
                        defaultValue={confirmationPassword}
                        handleInput={handleChange}
                    />
                    <button className='signup-button' disabled={!isValidated} >Sign In</button>
                    <span style={{cursor: 'pointer'}} onClick={handleNavigate}>Already have account?</span>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
