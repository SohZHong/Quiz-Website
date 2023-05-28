import React, { useEffect, useState } from 'react';
import "./ChapterOverview.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function ChapterOverview(){
    const [flashcards, setFlashcards] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();
    
    const { chapterID } = useParams();
    const location = useLocation();
    const { progression } = location.state;

    useEffect(() => {
        axios.get(`/api/student/get_chapter/${chapterID}`)
        .then(resp => {
            setFlashcards(resp.data.flashcards);
            setQuizzes(resp.data.quizzes);
        })
        .catch(err => console.error(err))
    }, [chapterID])

    const handleReturn = (e) => {
        e.preventDefault();
        navigate(-1);
    }

    const handleFlashcardClick = (e) => {
        e.preventDefault();
        navigate("flashcard", {state:{flashcards, progression}});

    }

    const handleQuizClick = (e) => {
        e.preventDefault();
        navigate("quiz", {state:{quizzes}});

    }

    return(
        <section className='Container'>
            <div className='chapter-overview-container'>
                <button className='return-button' onClick={handleReturn}>
                    <FontAwesomeIcon icon="fa-solid fa-arrow-left"/>
                    <span>Return</span>
                </button>
                <div className='chapter-section'>
                    <div className='section-wrapper'>
                        <button className={'flashcard-sec ' + (flashcards.length === 0 ? 'disable' : '')} onClick={handleFlashcardClick}>
                            <span>Flashcards</span>
                            <div className='flashcard-pic'></div>
                        </button>
                    </div>
                    <div className='section-wrapper'>
                        <button className={'quiz-sec ' + (quizzes.length === 0 ? 'disable' : '')} onClick={handleQuizClick}>
                            <span>Quizzes</span>
                            <div className='quiz-pic'></div>
                        </button>
                    </div>
                </div>
            </div>
        </section>
            )
}

export default ChapterOverview