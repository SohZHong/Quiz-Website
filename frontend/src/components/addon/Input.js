import React from "react";

function Input({label, type, name, placeholder, required, defaultValue, handleInput, pattern="^.{0,}$", title=""}){

    return (
        <div className="input-field">
            <div className='input-border'>
                <input 
                    type={type} 
                    name={name} 
                    placeholder={placeholder} 
                    required={required}
                    pattern={pattern}
                    title={title}
                    value={defaultValue}
                    onChange={(e) => handleInput(e)}
                />
                <span className='focus-border'></span>
            </div>
            {label !== "" ? <label htmlFor={name} className="label-text">{label}</label> : null}
        </div>
    )
}

export default Input