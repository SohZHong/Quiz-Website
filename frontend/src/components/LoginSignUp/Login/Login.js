import React, { useState } from 'react';
import './Login.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Input from '../../addon/Input';

function Login({ handleLogin }) {

  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = {...loginForm, [name] : value};
    setLoginForm(updatedData);
  }

  const handleNavigate = () => {
    navigate('/register')
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.get(`/api/login/${loginForm.username}/${loginForm.password}`)
    .then(resp => {
      if (resp.data.authentication){
        resp.data.userData.map(user => {
          //Check if the user is disabled
          if (user.status == 1){
            handleLogin(user);
            navigate(`/${user.type.toLowerCase()}/${user.id}`);
          }
          else {
            setShowErrorMessage(true);
          }
      });
      
      }
      else {
        setShowErrorMessage(true);
      }
    })
    .catch(err => console.error(err));
  }

  return (
    <section className="login-container">
      <div className="mainbox">
        <img alt='Company_Logo'/>
        <h2>Login</h2>
        <div style={{visibility: showErrorMessage ? 'visible' : 'hidden', margin: '10px', fontWeight: 'bold'}}>User Not Found!</div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <Input 
            label={"Username"}
            type={"text"}
            name={"username"}
            placeholder={""}
            required={true}
            defaultValue={loginForm.username}
            handleInput={handleChange}
          />
          <Input 
            label={"Password"}
            type={"password"}
            name={"password"}
            placeholder={""}
            required={true}
            defaultValue={loginForm.password}
            handleInput={handleChange}
          />
          <div className='options'>
            <span style={{cursor: 'pointer'}} onClick={handleNavigate}>Create account <FontAwesomeIcon icon="fa-solid fa-arrow-right"/></span>
          </div>
          <button className='signup-button'>Sign In</button>
        </form>

      </div>
    </section>
  );
}

export default Login;
