import React, { useState } from "react";

function ChapterFilter() {

    const options = [
        {
            value: 'date',
            label: 'Date Created'
        },
        {
            value: 'modified',
            label: 'Last Modified'
        },
        {
            value: 'most',
            label: 'Most Flashcards'
        }
    ];

    const getInitialState = () => {
        const value = "date";
        return value;
    };

    const [value, setValue] = useState(getInitialState);
  
    
    const handleChange = (e) => {
        setValue(e.target.value);
    };

    return (
        <div className='filter-button'>
            <select value={value} onChange={handleChange}>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
  )
}

export default ChapterFilter