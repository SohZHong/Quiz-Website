import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './CreateEditExam.scss';
import Pagination from '../../addon/Pagination';
import axios from 'axios';
import ExamList from './Exam/ExamList';

function CreateExam() {
    const [questions, setQuestions] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [questionPerPage, setQuestionPerPage] = useState(5); //Default Rows Per Page
    const options = [5, 10, 15];
    const range = useState(5);

    const navigate = useNavigate();
    let { teacherID, classID } = useParams();

    useEffect(() => {
        setQuestions([{ id: 1, question: '', answer: '', option1: '', option2: '', option3: '' }]);
    }, []);
    
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

    //Determining number of pages and filtering rows
    const pageCount = Math.ceil(questions.length / questionPerPage);
    const pageRowOffset = currentPage * questionPerPage;

    const onAddQuestion = () => {
        const newQuestion = {
        id: (Math.max(...questions.map(question => question.id), 0) + 1).toString(), //Increment upon current max id
        question: '',
        answer: '',
        option1: '',
        option2: '',
        option3: '',
        }
        setQuestions([...questions, newQuestion])
    }

    const onRemoveQuestion = (e, questionID) => {
        e.preventDefault();
        //Prevent deletion when it has one question left
        if (questions.length > 1){
          const updatedList = questions.filter(question => (
            question.id !== questionID && {...question, question}
          )
          )
          setQuestions(updatedList);
        }
    }

  const handleReset = (e) => {
    e.preventDefault();
    setQuestions([{ id: 1, question: '', answer: '', option1: '', option2: '', option3: '' }]);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const sendPostRequest = async () => {
        await axios.post("/api/teacher/create_exam", {data: {
          classID,
          exam: questions,
        }})
        .catch(err => console.error(err))
    };
    //Backend: Send current users table to flask backend for saving
    sendPostRequest();
    navigate("/teacher/" + teacherID + "/class/" + classID);
  }

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

export default CreateExam