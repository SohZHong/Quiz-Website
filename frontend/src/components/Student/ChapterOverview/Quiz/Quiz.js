import React, { useState, useEffect, useCallback } from 'react';
import './Quiz.scss'
import QuestionList from '../../../addon/QuestionList';
import { useLocation, useNavigate } from 'react-router-dom';
import ResultsModal from '../../../addon/ResultsModal';

function Quiz({ user: {name} }) {
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [score, setScore] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        var questionSet = location.state.quizzes.map(q => {
            const options = [q.answer, q.option1, q.option2, q.option3];
            
            // Fisher-Yates shuffle algorithm link (https://javascript.info/task/shuffle)
            for (let i = options.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [options[i], options[j]] = [options[j], options[i]];
            }
            
            return {
                id: q.id,
                question: q.question,
                answer: q.answer,
                options: options
            };
        });
        setQuestions(questionSet);
    }, [location.state]);

    const handleOpenModal = () => {
        setIsOpen(true)
    }

    const handleCloseModal = (e) => {
        e.preventDefault()
        navigate(-1);
    }

    const handleAnswerChange = useCallback(newSelectedAnswers => {
          setSelectedAnswers(newSelectedAnswers);
        },[setSelectedAnswers]
    );

    const handleSubmit = (e) => {
        e.preventDefault();

        let correctAnswerCount = 0;
        const len = questions.length;

        for (let i = 0; i < len; i++) {
            const question = questions[i];
            const answer = selectedAnswers[i];

            if (answer === {}){
                continue
            }
            else if (question.answer === answer.text) {
                correctAnswerCount++;
            }
        }

        let finalScore = Number(correctAnswerCount/len*100).toFixed(0);

        setScore(finalScore)
        handleOpenModal();
    }

    const isSubmitDisabled = selectedAnswers.length !== questions.length;

    return(
        <React.Fragment>
            <ResultsModal 
                isOpen={isOpen}
                onClose={handleCloseModal}
                score={score}
            />
            <section className="Container">
                <div className='quiz-container'>
                    <div className="quiz-wrapper">
                        <div className='quiz-container-header'>
                            <h1>Quiz</h1>
                            <h3 style={{textAlign: 'center'}}>{name}</h3>
                            <button 
                                onClick={handleSubmit}
                                disabled={isSubmitDisabled}
                                className={isSubmitDisabled ? 'disable' : ''}
                            >
                                Submit
                            </button>
                        </div>

                        <div className='quiz-questions'>
                            <QuestionList
                                questions={questions}
                                handleAnswerChange={handleAnswerChange}
                            />
                        </div>
                        
                    </div>
                </div>
            </section>
        </React.Fragment>
    )
       
}   

export default Quiz