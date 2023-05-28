import React, { useEffect, useState } from "react";
import './ProfileOverview.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";
import axios from "axios";

function ProfileOverview(){

    let { userType, userID } = useParams();

    const [user, setUser] = useState({});


    useEffect(() => {

        axios.get(`/api/profile/${userType}/${userID}`)
        .then(resp => {
            const updatedUser =
            resp.data.map(user => {
                const updatedValues = {...user};

                //Replace all null values with undisclosed
                for (const key in updatedValues){
                    if (updatedValues[key] === null && key !== "profile") {
                        updatedValues[key] = 'Undisclosed';
                    }
                }
                return updatedValues;
            });

            setUser(updatedUser[0]);
        })
        .catch(err => console.error(err))

    }, [userType, userID])

    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    }

    return (
        <section className="Container">
            <div className="user-profile-wrapper">
                <img className="user-profile-picture" alt={user.name} src={require('../../images/user_profiles/' + (user.profile == null ? "no_pic.png" : user.profile))}/>
                <h2 className="user-profile-name">{user.name}</h2>
            </div>
            <div className="info-wrapper">
                <div className="info-title">
                    <FontAwesomeIcon icon="fa-solid fa-circle-user" />
                    <h3>General</h3>
                </div>
                <div className="info-container">
                    <div className="info-item">
                        <h5 className="label-text">Name</h5>
                        <h3>{user.name}</h3>
                    </div>
                    <div className="info-item">
                        <h5 className="label-text">Age</h5>
                        <h3>{user.age}</h3>
                    </div>
                    <div className="info-item">
                        <h5 className="label-text">Email</h5>
                        <h3>{user.email}</h3>
                    </div>
                    <div className="info-item">
                        <h5 className="label-text">Admission / Workplace</h5>
                        <h3>{user.workplace}</h3>
                    </div>
                    <div className="info-item">
                        <h5 className="label-text">Contact</h5>
                        <h3>{user.phone}</h3>
                    </div>
                    <div className="info-item">
                        <h5 className="label-text">Account Type</h5>
                        <h3>{capitalize(userType)}</h3>
                    </div>
                </div>
            </div>
            <div className="info-wrapper">
                <div className="info-title">
                    <FontAwesomeIcon icon="fa-solid fa-circle-info" />
                    <h3>Additional Information</h3>
                </div>
                <div className="info-container">
                    <div className="info-item">
                        <h5 className="label-text">{userType === "student" ? "Classes Joined" : "Classes Owned"}</h5>
                        <h3>{user.classCount}</h3>
                    </div>
                    <div className="info-item">
                        <h5 className="label-text">{userType === "student" ? "Chapters Completed" : "Chapters Created"}</h5>
                        <h3>{user.chapterCount}</h3>
                    </div>
                </div>
            </div>
        </section>
    )

}

export default ProfileOverview