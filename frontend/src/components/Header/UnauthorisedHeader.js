import React from 'react'
import '../addon/ProfileDropdown'
import './Header.scss'
import { Link, useNavigate } from 'react-router-dom'

function UnauthorisedHeader() {

    const navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        navigate("/login");
    }

    return (
        <header className="Header">
        <div className="Left">
            <Link to={"/"}>
                <img alt='Company_Logo'/>
            </Link>
        </div>
        <div className="Right">
            <button style={{padding: '10px', margin: '0 10px', width: '50%', float: 'right'}} onClick={handleClick} >Login</button>
        </div>
        </header>
    )
}

export default UnauthorisedHeader