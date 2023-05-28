import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './CreateEditExam.scss';
import ExamList from './Exam/ExamList';
import Pagination from '../../addon/Pagination';
import axios from 'axios';

function EditExam() {

    const [questions, setQuestions] = useState([]);
    const [questionsToDelete, setQuestionsToDelete] = useState([]);
    const [initialQuestions, setInitialQuestions] = useState([]);
    const [questionIncrement, setQuestionIncrement] = useState(0);
    const [initialQuestionIncrement, setInitialQuestionIncrement] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [questionPerPage, setQuestionPerPage] = useState(5); //Default Rows Per Page
    const options = [5, 10, 15];
    const range = useState(5);

    const navigate = useNavigate();
    let { teacherID, classID, examID } = useParams();

    useEffect(() => {
        axios.get(`/api/teacher/class/edit_exam/${examID}`)
        .then(resp => {

            let questionData = resp.data.questions;
            let questionIncrementValue = parseInt(resp.data.questionIncrement);

            setQuestions(questionData);
            setInitialQuestions(questionData);
            setQuestionIncrement(questionIncrementValue);
            setInitialQuestionIncrement(questionIncrementValue);

        }
        )
    }, [classID, examID]);


    const handleChange = (e, id) => {
        const { name, value } = e.target;

        const updatedQuestions = questions.map(question => (
                question.id === id ? {...question, [name] : value} : question
            )
        )
        setQuestions(updatedQuestions);
    }

    const handleRowChange = (e) => {
        setQuestionPerPage(e.target.value)
    }


    const handlePageChange = (e) => {
        setCurrentPage(e.selected);
    };

    const onAddQuestion = () => {
        const newQuestion = {
        id: (questionIncrement + 1).toString(), //Increment upon current max id
        question: '',
        answer: '',
        option1: '',
        option2: '',
        option3: '',
        }
        setQuestionIncrement(prevState => prevState + 1);
        setQuestions([...questions, newQuestion])
    }

    const onRemoveQuestion = (e, questionID) => {
        e.preventDefault();

        //Prevent deletion when it has one question left
        if (questions.length > 1){

            const shouldDelete = questions
            .filter(question => question.id === questionID && parseInt(question.id) > initialQuestionIncrement)

            if (shouldDelete.length > 0){
                const deletedQuestions =  shouldDelete.map(question => ({ id: question.id }));
                setQuestionsToDelete(prevQuestionsToDelete => [...prevQuestionsToDelete, ...deletedQuestions]);
            }

            const updatedList = questions.filter(question => (
                question.id !== questionID && {...question, question}
            )
          )
          setQuestions(updatedList);
        }
    }


    const handleReset = (e) => {
        e.preventDefault();

        setQuestions(initialQuestions);
        setQuestionIncrement(initialQuestionIncrement);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const sendRemoveRequest = async () => {
            await axios.post("/api/teacher/remove_exam_question", {data: questionsToDelete})
            .catch(err => console.error(err))
        }

        const sendPostRequest = async () => {
            await axios.post("/api/teacher/update_exam", {
                id: examID,
                questions: questions
            })
            .catch(err => console.error(err))
        };

        if (questionsToDelete.length > 0){
            sendRemoveRequest();
            setQuestionsToDelete([]);
        }

        sendPostRequest();
        setInitialQuestionIncrement(questionIncrement);
        navigate("/teacher/" + teacherID + "/class/" + classID);
    }

    const pageCount = Math.ceil(questions.length / questionPerPage);
    const pageRowOffset = currentPage * questionPerPage;

    return (
        <section className='Container'>
        <form onSubmit={handleSubmit}>
          <h2 className='title'>
            <FontAwesomeIcon icon="fa-solid fa-folder-open" />
              Create Exam
          </h2>
          <div className='input-container'>
            <h2 className='label-text'>Questions</h2>
            <ExamList
              questions={questions.slice(pageRowOffset, pageRowOffset + questionPerPage)} 
              onAddQuestion={onAddQuestion} 
              onRemoveQuestion={onRemoveQuestion}
              handleInput={handleChange}
            />
            <Pagination 
              options={options}
              pageCount={pageCount}
              pageRange={range}
              handleRowChange={handleRowChange}
              handlePageChange={handlePageChange}
            />
          </div>
          <div className='button-container'>
            <button className="submit-button" type='submit'>Create</button>
            <button className="reset-button" type='reset' onClick={handleReset}>Reset</button>
          </div>
        </form>
      </section>

    )
}

export default EditExam