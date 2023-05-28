import React from "react";
import TextArea from "./TextArea";

function InputArea({index, label, name, placeholder, defaultValue, required, handleInput}){

    return (
        <div className="input-field">
            {label !== "" ? <label htmlFor={name} className="label-text">{label}</label> : null}
            <TextArea
                index={index}
                rows={7}
                maxLength={600}
                name={name}
                value={defaultValue}
                placeholder={placeholder}
                onTextAreaChange={handleInput}
                required={required}
            />
        </div>
    )
}

export default InputArea