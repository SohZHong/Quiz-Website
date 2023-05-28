import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "./FlashcardList.scss";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function FlashcardList(){
    const location = useLocation();
    const [flashcards, setFlashcards] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [progression, setProgression] = useState(Boolean);
    const [completed, setCompleted] = useState(false);
    const navigate = useNavigate();
    
    const { studentID, chapterID } = useParams();

    useEffect(() => {
        setFlashcards(location.state.flashcards)
        setProgression(location.state.progression)
    }, [location.state])

    const totalFlashcards = flashcards.length;
    const activeContentfor1st = flashcards[activeIndex];
    const activeContentfor2nd = flashcards[(activeIndex + 1) % flashcards.length];
    const activeContentfor3rd = flashcards[(activeIndex + 2) % flashcards.length];

    const handleBackButtonClicked = () => {
        navigate(-1);
    }

    const handleButtonClicked = () => {
        //Mark the student as completed after finish reading all the flashcards
        if ((activeIndex + 1) ===  flashcards.length && !progression && !completed){
            axios.post("/api/student/update_chapter_progress", {data: {studentID, chapterID}})
            .then(() => setCompleted(true)) //Set completion status
            .catch(err => console.error(err))
        }
    }

    const nextButton = () => {
        // Get the active contents for the two cards
        const activeContentfor1st = flashcards[activeIndex];
        const activeContentfor2nd = flashcards[(activeIndex + 1) % flashcards.length];
    
        // Add the animation class to the first card
        const firstCard = document.querySelector('.firstcard');
        firstCard.classList.add('next');

        
        
        // Wait for the animation to finish, then update the content of both cards and remove the animation class
        firstCard.addEventListener('animationend', () => {
            // Set the next content in the state
            setActiveIndex((activeIndex + 1)% flashcards.length);


            const secondCardTitle = document.querySelector('.secondcard .Fc_title');
            const secondCardDesc = document.querySelector('.secondcard .Fc_desc');
            secondCardTitle.innerText = activeContentfor2nd.title;
            secondCardDesc.innerText = activeContentfor2nd.description;
    
            const firstCardTitle = document.querySelector('.firstcard .Fc_title');
            const firstCardDesc = document.querySelector('.firstcard .Fc_desc');
            firstCardTitle.innerText = activeContentfor1st.title;
            firstCardDesc.innerText = activeContentfor1st.description;
            

            firstCard.classList.remove('next');
        })

        handleButtonClicked();
    }
    
    const previousButton = () => {
    
        // Add the animation class to the first card
        const firstCard = document.querySelector('.firstcard');
        const thirdCard = document.querySelector('.thirdcard');
        thirdCard.classList.add('previous');
        
        
        // Wait for the animation to finish, then update the content of both cards and remove the animation class
        thirdCard.addEventListener('animationend', () => {
            //ready the previous content
            setActiveIndex((activeIndex - 1 + flashcards.length) % flashcards.length);

    
            const firstCardTitle = document.querySelector('.firstcard .Fc_title');
            const firstCardDesc = document.querySelector('.firstcard .Fc_desc');
            firstCardTitle.innerText = activeContentfor1st.title;
            firstCardDesc.innerText = activeContentfor1st.description;
    
            thirdCard.classList.remove('previous');
            
        })

        handleButtonClicked();
    }

    // Check if flashcards array is empty
    if (flashcards.length === 0) {
        return (
            <section className='Container'>
                <h1>Loading...</h1>
            </section>

        );
    }

    return (
        <div className="flashcard-container">
            <div className="flashcard_count">
                {activeIndex + 1}/{totalFlashcards}
            </div>
            <button className='back-button' onClick={handleBackButtonClicked}>
                Return
            </button>
            <div className='card-grp'>
                <div className='main-card card firstcard'>
                    <div className='Fc_title'>{activeContentfor1st.title}</div>

                    <div className='Fc_descbox'>
                        <div className='Fc_desc'>{activeContentfor1st.description}</div>
                    </div>
                            
                </div>

                <div className='main-card card secondcard'>
                    <div className='Fc_title'>{activeContentfor2nd.title}</div>

                    <div className='Fc_descbox'>
                        <div className='Fc_desc'>{activeContentfor2nd.description}</div>
                    </div>
                </div>

                <div className='main-card card thirdcard'>
                    <div className='Fc_title'>{activeContentfor3rd.title}</div>

                    <div className='Fc_descbox'>
                        <div className='Fc_desc'>{activeContentfor3rd.description}</div>
                    </div>
                </div>

                <div className='back-card1 card'></div>

                <div className='back-card2 card'></div>
                        
            </div>
            <div className="flashcard_button">
                <button className="previous-btn flashcard-btn" onClick={previousButton}>
                    <FontAwesomeIcon icon="fa-solid fa-arrow-left" size="2xl" />
                </button>
                <button className="next-btn flashcard-btn" onClick={nextButton}>
                    <FontAwesomeIcon icon="fa-solid fa-arrow-right" size="2xl" />
                </button>
            </div>
        </div>
    );
  }
            


export default FlashcardList;