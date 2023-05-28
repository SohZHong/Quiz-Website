import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PromptButton from "../../../addon/PromptButton";

function Exam({ exam: {id, score, posted} }){

    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const attempted = score !== null;

    const handleConfirmAttempt = (completed) => {
        //Ask attempted students if they want to attempt again
        if (completed){
            navigate(`exam/${id}`);
        }
    }

    const handleOpenPrompt = (e) => {
        e.preventDefault();
        setIsOpen(true);
    };
      
    const handleClosePrompt = (e) => {
        e.preventDefault();
        setIsOpen(false);
    }

    return (
        <div className='exam-container'>
            <PromptButton 
                message={attempted ? "Do you wish to reattempt? Your previous result will be overwritten" : "Do you wish to start?"}
                confirmText={"Confirm"}
                cancelText={"Cancel"}
                confirmAction={handleConfirmAttempt}
                isOpen={isOpen}
                onClose={handleClosePrompt}
            />
            <span className="posted-date">Posted on {posted}</span>
            <div className="exam-score-wrapper">
                <h3>Exam Score</h3>
                <h1 className="score-progress">
                   {attempted ? score : 0}% 
                </h1>
            </div>
            <button className="attempt-button" onClick={handleOpenPrompt}>
                {attempted ? "Reattempt" : "Take Exam"}
            </button>
        </div>
    )
}

export default Exam