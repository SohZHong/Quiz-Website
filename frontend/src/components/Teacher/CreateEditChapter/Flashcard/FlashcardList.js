import React from "react";
import Flashcard from "./Flashcard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function FlashcardList({ flashcards, onAddFlashcard, onRemoveFlashcard, handleInput }) {

  const handleClick = (e) => {
    e.preventDefault();
    onAddFlashcard();
  }

  return (
    <React.Fragment>
      {flashcards.map((flashcard, index) => 
        <Flashcard 
        key={index} 
        index={index} 
        flashcard={flashcard} 
        onRemoveFlashcard={onRemoveFlashcard}
        handleInput={handleInput} />
      )}
      <button className="add-button" onClick={handleClick}>
        <FontAwesomeIcon icon="fa-solid fa-calendar-plus" />   
        Add New Flashcard
      </button>
    </React.Fragment>
  )
}

export default FlashcardList;
