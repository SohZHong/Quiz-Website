import React, { useState} from 'react';

function QuestionList({ questions, handleAnswerChange }){
    
    const [selectedAnswers, setSelectedAnswers] = useState(
        Array(questions.length).fill({})
      );
    
    const onAnswerClick = (e, questionIndex, answerIndex) => {
        e.preventDefault();
        const newSelectedAnswers = [...selectedAnswers];

        newSelectedAnswers[questionIndex] = {
          index: answerIndex,
          text: questions[questionIndex].options[answerIndex]
        };

        setSelectedAnswers(newSelectedAnswers);
        handleAnswerChange(newSelectedAnswers);
    };

    return (
        <React.Fragment>
        {questions.map((question, index) => (
            <div key={question.id} className="display_question"   style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="question_title">{index + 1}. {question.question}</span>
            {question.options.map((option, optionIndex) => (
                <button
                type='submit'
                className="question_answers" key={optionIndex}
                style={{
                backgroundColor:
                    selectedAnswers[index] && selectedAnswers[index].index === optionIndex
                    ? 'green'
                    : 'white',
                }}
                    onClick={(e) => onAnswerClick(e, index, optionIndex)}
                >
                    {option}
                </button>
    
            ))}
            </div>
        ))}
        </React.Fragment>
    );
};

export default QuestionList;