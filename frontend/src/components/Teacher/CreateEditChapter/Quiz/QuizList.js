import React from 'react';
import Quiz from './Quiz';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function QuizList( {quizzes, onAddQuiz, onRemoveQuiz ,handleInput} ) {

  const handleClick = (e) => {
    e.preventDefault();
    onAddQuiz();
  }

  return (
    <div>
      {quizzes.map((quiz, index) => 
        <Quiz 
          key={index} 
          index={index} 
          quiz={quiz} 
          onRemoveQuiz={onRemoveQuiz}
          handleInput={handleInput}
        />
      )}
      <button className="add-button" onClick={handleClick}>
        <FontAwesomeIcon icon="fa-solid fa-credit-card" />
        Add New Question
      </button>
    </div>
  );
}

export default QuizList;
