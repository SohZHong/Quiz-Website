import React, { useEffect, useState } from "react";
import Input from "../../addon/Input";
import axios from "axios";
import './Profile.scss'

function Profile({ user:{id, name, age, email, workplace, phone, type, profile, status}}){
    const [userProfile, setUserProfile] = useState({
        username: '',
        password: '',
        email: ''
    });
    const [initialUserProfile, setInitialUserProfile] = useState({});

    useEffect(() => {
        axios.get(`/api/${type}/${id}/profile`)
        .then(resp => {
            const user = resp.data[0];
            setUserProfile(user);
            setInitialUserProfile(user);
        })
        .catch(err => console.error(err));
    }, [type, id])

    const handleChange = (e) => {
        const { name, value } = e.target;

        const updatedData = {...userProfile, [name] : value};
        setUserProfile(updatedData);
    }

    const handleReset = (e) => {
        e.preventDefault();
        setUserProfile(initialUserProfile);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios.post("/api/update_profile", {data: userProfile, id, type});
        setInitialUserProfile(userProfile);
    }

    return (
        <section className="Container">
            <h2 className="title">Edit Your Personal Information</h2>
            <form className="profile-container" onSubmit={handleSubmit}>
                <div className="input-container">
                    <Input 
                        label={"Username"}
                        type={"text"}
                        name={"username"}
                        placeholder={""}
                        required={true}
                        defaultValue={userProfile.username}
                        handleInput={handleChange}
                    />
                    <Input 
                        label={"Password"}
                        type={"password"}
                        name={"password"}
                        placeholder={""}
                        required={true}
                        defaultValue={userProfile.password}
                        handleInput={handleChange}
                    />
                    <Input 
                        label={"Email"}
                        type={"email"}
                        name={"email"}
                        placeholder={""}
                        required={true}
                        defaultValue={userProfile.email}
                        handleInput={handleChange}
                    />
                    <div className="button-container">
                        <button className="submit-button" type="submit">Update</button>
                        <button className="reset-button" type="reset" onClick={handleReset} >Reset</button>
                    </div>
                </div>
            </form>
        </section>
    )

}

export default Profile