import React from 'react'
import '../addon/ProfileDropdown'
import './Header.scss'
import ProfileDropdown from '../addon/ProfileDropdown'
import { Link } from 'react-router-dom'

function AuthorisedHeader({ user:{id, name, type, profile}, handleLogout }) {

  const profile_picture = profile == null ? 'no_pic.png' : profile;
  
  return (
    <header className="Header">
      <div className="Left">
        <Link to={"/"}>
          <img alt='Company_Logo'/>
        </Link>
      </div>
      <div className="Right">
          <div className='profile'>
          <img alt='User_Profile' className='user-profile' src={require('../../images/user_profiles/' + profile_picture)}/>
            <ProfileDropdown 
              id={id}
              name={name}
              accountType={type}
              handleLogout={handleLogout}
            />
          </div>
      </div>
    </header>

  )
}

export default AuthorisedHeader