import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Routes, Route } from 'react-router-dom';
import './Footer.scss'
import { Link } from 'react-router-dom'


function Footer(){

    return (
        <React.Fragment>
            <footer className='Footer'>
                <section className='Top'>
                    <div className='description'>
                        <img alt='Company_Logo'/>
                        <div>A platform that helps you learn better!</div>
                    </div>
                    
                    <nav className='footer-options'>
                        <Link to={"/support"}>Contact Us</Link>
                        <Link to={"/t&c"}>Terms of Service</Link>
                        <Link to={"/policy"}>Privacy Policy</Link>
                    </nav>
                </section>
                <section className='Bottom'>
                    <div className='copyright'>
                        © 2023 Zeria Technologies, Inc
                    </div>
                    <div className='social-icons'>
                        <a className='dark-Button' href='/#'>
                            <FontAwesomeIcon icon="fa-brands fa-facebook-f" />
                        </a>
                        <a className='dark-Button' href='/#'>
                            <FontAwesomeIcon icon="fa-brands fa-twitter" />
                        </a>
                        <a className='dark-Button' href='/#'>
                            <FontAwesomeIcon icon="fa-brands fa-instagram" />
                        </a>
                    </div>

                </section>
            </footer>
        </React.Fragment>
    )
}

export default Footer