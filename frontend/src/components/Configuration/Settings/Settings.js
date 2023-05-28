import React, { useEffect, useState } from "react";
import Input from "../../addon/Input";
import axios from "axios";
import './Settings.scss'

function Settings({ user:{id, name, age, email, workplace, phone, type, profile, status}, onSettingsChange }){
    //Declare keys to ensure controlled input
    const [userSettings, setUserSettings] = useState({
        id: id,
        name: name,
        age: age,
        email: email,
        workplace: workplace,
        phone: phone,
        profile: profile
    });
    const [initialUserSettings, setInitialUserSettings] = useState({});
    const [displayedImage, setDisplayedImage] = useState(null);

    useEffect(() => {
        setInitialUserSettings(userSettings);
    }, [userSettings])

    const loadImage = (e) => {
        setDisplayedImage(e.target.files[0]);
        var image = document.getElementById("output");
        image.src = URL.createObjectURL(e.target.files[0]); //Temporary url for image
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        let inputValue = value;

        if (name === 'profile'){
            const file = e.target.files[0];
            inputValue = file.name;
        }

        const updatedData = {...userSettings, [name] : inputValue};
        setUserSettings(updatedData);
    }

    const handleImageUpload = (e) => {
        loadImage(e);
        handleChange(e);
    }

    const handleReset = (e) => {
        e.preventDefault();
        setDisplayedImage(null);
        setUserSettings(initialUserSettings);
        var image = document.getElementById("output");
        image.src = require('../../../images/user_profiles/' + (initialUserSettings.profile == null ? 'no_pic.png' : initialUserSettings.profile)); // display initial image
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        //If profile picture is changed
        if (displayedImage) {
            const formData = new FormData();
            formData.append('file', displayedImage, displayedImage.name);

            await axios.post ('/api/upload_image/user_profiles', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .catch(err => console.error(err))
        }

        await axios.post("/api/update_settings", {data: userSettings, type});
        setInitialUserSettings(userSettings);
        onSettingsChange({...userSettings, type: type, status: status});
    }

    const profile_picture = displayedImage ? 
        URL.createObjectURL(displayedImage) : 
        require('../../../images/user_profiles/' + (userSettings.profile == null ? 'no_pic.png' : userSettings.profile));

    return (
        <section className="Container">
            <h2 className="title">Settings</h2>
            <form className="settings-container" onSubmit={handleSubmit}>
                <div className="profile-container">
                    <div className="profile_pic">
                        <label htmlFor="file">Change Image</label>
                        <input className="input-img" id="file" name="profile" type="file" onChange={handleImageUpload} accept="image/jpeg, image/png, image/jpg"/>
                        <img className="picture" alt="profile_picture" src={profile_picture} id="output"/>
                    </div>
                </div>
                <div className="input-container">
                <Input 
                        label={"Name"}
                        type={"text"}
                        name={"name"}
                        placeholder={""}
                        required={true}
                        defaultValue={userSettings.name}
                        handleInput={handleChange}
                    />
                    <Input 
                        label={"Age"}
                        type={"number"}
                        name={"age"}
                        placeholder={""}
                        required={false}
                        defaultValue={userSettings.age == null ? 0 : userSettings.age}
                        handleInput={handleChange}
                    />
                    <Input 
                        label={"Email"}
                        type={"email"}
                        name={"email"}
                        placeholder={""}
                        required={true}
                        defaultValue={userSettings.email}
                        handleInput={handleChange}
                    />
                    <Input 
                        label={"Workplace / Admission"}
                        type={"text"}
                        name={"workplace"}
                        placeholder={""}
                        required={false}
                        defaultValue={userSettings.workplace == null ? "" : userSettings.workplace}
                        handleInput={handleChange}
                    />
                    <Input 
                        label={"Contact Number"}
                        type={"tel"}
                        name={"phone"}
                        pattern={"^(01[12])[0-9]{7,8}$"}
                        placeholder={""}
                        title={"Please follow Malaysian Phone Format"}
                        required={false}
                        defaultValue={userSettings.phone == null ? "" : userSettings.phone}
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

export default Settings