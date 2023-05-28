import React, { useState, useEffect, useCallback } from 'react';
import './ExamSection.scss';
import QuestionList from '../../addon/QuestionList'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ResultsModal from '../../addon/ResultsModal';


function ExamSection( {user: {id, name}} ) {
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [score, setScore] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
   
    let { examID } = useParams();

    useEffect(() => {
        axios.get(`/api/get_exam_questions/${examID}`)
        .then(resp => {
            setQuestions(resp.data);

            var questionSet = resp.data.map(q => { 
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
        });
    }, [examID]);

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

        const sendPostRequest = async(score) => {
            await axios.post("/api/student/update_exam_progress", {data: {id, examID, score}})
            .catch(err => console.error(err))
        }

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
        sendPostRequest(finalScore);
        handleOpenModal();
    }

    return(
        <React.Fragment>
            <ResultsModal 
                isOpen={isOpen}
                onClose={handleCloseModal}
                score={score}
            />
            <section className="Container">
                <div className='exam-container'>
                    <div className="exam-wrapper">
                        <div className='exam-container-header'>
                            <h1>Exam</h1>
                            <h3 style={{textAlign: 'center'}}>{name}</h3>
                            <button onClick={handleSubmit}>
                                Submit
                            </button>
                        </div>

                        <div className='exam-questions'>
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

export default ExamSection