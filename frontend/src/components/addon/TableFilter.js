import React from "react";

function TableFilter({ options, onSelect }) {

    const handleChange = (e) => {
      onSelect(e);
    };
  
    return (
        <select className="row-options" onChange={handleChange}>
            {options.map(option => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
}

export default TableFilter