import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Exam from "./Exam";

function ExamList({ questions, onAddQuestion, onRemoveQuestion, handleInput }) {

  const handleClick = (e) => {
    e.preventDefault();
    onAddQuestion();
  }

  return (
    <React.Fragment>
      {questions.map((question, index) => 
        <Exam
            key={index} 
            index={index} 
            question={question} 
            onRemoveQuestion={onRemoveQuestion}
            handleInput={handleInput} />
      )}
      <button className="add-button" onClick={handleClick}>
        <FontAwesomeIcon icon="fa-solid fa-calendar-plus" />   
        Add New Question
      </button>
    </React.Fragment>
  )
}

export default ExamList;