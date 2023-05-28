import React from "react";
import { Link } from "react-router-dom";
import './PageNotFound.scss';

function PageNotFound({ isAuthorised }){

    return (
        <section className="Container">
            <div className="error-container">
                <div className="error-wrapper">
                    <div className="error-text">
                        <h1>
                            Oops!
                        </h1>
                        <h2>
                            The page you're looking for can't be found.
                        </h2>
                        <div className="nav-container">
                            <h3>Here are some useful links instead!</h3>
                            <br />
                            <nav className="nav-links">
                            {isAuthorised ? (
                                <Link to={"/"}>Dashboard</Link>
                            ) : (
                                <React.Fragment>
                                    <Link to={"/"}>Home</Link>
                                    <Link to={"/about"}>About Us</Link>
                                    <Link to={"/login"}>Login</Link>
                                </React.Fragment>
                            )}
                            </nav>
                        </div>
                    </div>
                    <img className="error-image" alt="404" src={require('../../images/404-Image.png')}/>
                </div>
            </div>
        </section>


    )

}

export default PageNotFound;