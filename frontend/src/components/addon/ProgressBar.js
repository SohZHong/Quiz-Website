import React from "react";

function ProgressBar(props) {
    const { completion } = props //Accept completion progress as argument from parent

    const barContainerStyles = {
        height: 15,
        width: '100%',
        backgroundColor: '#c8ecea',
        borderRadius: 25,
        marginTop: 20,
        marginBottom: 10
    }

    const barFillerStyles = {
        height: '100%',
        width: `${completion}%`,
        backgroundColor: '#4B6A9F',
        borderRadius: 'inherit', //25
        transition: 'width 1s ease-in-out',
    }

    const barProgressStyles = {
        padding: 5
    }

    return(
        <div style = {barContainerStyles}>
            <div style = {barFillerStyles}>
                <span style = {barProgressStyles}></span>
            </div>
        </div>
    )
}

export default ProgressBar