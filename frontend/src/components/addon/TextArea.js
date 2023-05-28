import React, { useState, useEffect } from 'react';
import $ from 'jquery';

function TextArea ({ index, rows, maxLength, name, value, placeholder, required, onTextAreaChange }) {
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        setCounter($('#textarea' + index).val().length);
    }, [value, index]);

    const handleChange = (e) => {
        setCounter(e.target.value.length);
        onTextAreaChange(e);
    };

    return (
    <div className='textarea-wrapper'>
        <textarea
            id={'textarea' + index}
            className='textarea'
            name={name}
            rows={rows}
            maxLength={maxLength}
            placeholder={placeholder}
            onChange={handleChange}
            defaultValue={value}
            required={required}
        ></textarea>
        <div id='counter'>
        <span id='current'>{counter}</span>
        <span id='maximum'> / {maxLength}</span>
        </div>
    </div>
    );
};

export default TextArea;