import React from 'react';
import Input from '../../../addon/Input';
import InputArea from '../../../addon/InputArea';

function Flashcard ({ index, flashcard: {id, title, content}, onRemoveFlashcard, handleInput }) {

    return (
      <div className='create-flashcard-container' action='#/'>
        <div className='container-display'>
          <h2>{index+1}</h2>
          <button onClick={(e) => onRemoveFlashcard(e, id)}>X</button>
        </div>
        <Input
            label={"Flashcard Title"}
            type={"text"}
            name={"flashcard-title"}
            placeholder={"Insert Title Here..."}
            required={true}
            defaultValue={title}
            handleInput={(e) => handleInput(e, id)}
        />
        <InputArea
          index={index}
          label={"Content"}
          name={"flashcard-content"}
          placeholder={"Insert learning materials here..."}
          defaultValue={content}
          required={true}
          handleInput={(e) => handleInput(e, id)}
        />
      </div>
    );
};

export default Flashcard;
