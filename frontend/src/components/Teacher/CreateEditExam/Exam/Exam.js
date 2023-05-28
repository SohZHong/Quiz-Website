import React from 'react';
import Input from '../../../addon/Input';

function Exam ({ index, question:{id, question, answer, option1, option2, option3}, onRemoveQuestion ,handleInput }){

  return (
    <div className="create-question-container">
      <div className='container-display'>
        <h2>{index+1}</h2>
        <button onClick={(e) => onRemoveQuestion(e, id)}>X</button>
      </div>
      <Input
        label={"Question"}
        type={"text"}
        name={"question"}
        placeholder={"Insert Question Here..."}
        required={true}
        defaultValue={question}
        handleInput={(e) => handleInput(e, id)}
        />
      <div className="question-options">
        <Input
            label={"Answer"}
            type={"text"}
            name={"answer"}
            placeholder={"Insert Answer Here..."}
            required={true}
            defaultValue={answer}
            handleInput={(e) => handleInput(e, id)}
        />
        <Input
            label={"Option 1"}
            type={"text"}
            name={"option1"}
            placeholder={"Insert Option Here..."}
            required={true}
            defaultValue={option1}
            handleInput={(e) => handleInput(e, id)}
        />
        <Input
            label={"Option 2"}
            type={"text"}
            name={"option2"}
            placeholder={"Insert Option Here..."}
            required={true}
            defaultValue={option2}
            handleInput={(e) => handleInput(e, id)}
        />
        <Input
            label={"Option 3"}
            type={"text"}
            name={"option3"}
            placeholder={"Insert Option Here..."}
            required={true}
            defaultValue={option3}
            handleInput={(e) => handleInput(e, id)}
        />
      </div>
    </div>
  );
};

export default Exam;
