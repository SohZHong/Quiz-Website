import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './CreateEditChapter.scss';
import FlashcardList from './Flashcard/FlashcardList';
import QuizList from './Quiz/QuizList';
import Input from '../../addon/Input';
import Pagination from '../../addon/Pagination';
import axios from 'axios';

function EditChapter() {
  const [chapterData, setChapterData] = useState({});
  const [flashcards, setFlashcards] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [flashcardIncrement, setFlashcardIncrement] = useState(0);
  const [quizIncrement, setQuizIncrement] = useState(0);

  //Initial State of table
  const [initialChapterData, setInitialChapterData] = useState({});
  const [initialFlashcards, setInitialFlashcards] = useState([]);
  const [initialQuizzes, setInitialQuizzes] = useState([]);
  const [initialFlashcardIncrement, setInitialFlashcardIncrement] = useState(0);
  const [initialQuizIncrement, setInitialQuizIncrement] = useState(0);

  //Array for deletion
  const [flashcardsToDelete, setFlashcardsToDelete] = useState([]);
  const [quizzesToDelete, setQuizzesToDelete] = useState([]);

  //Flashcard Pagination
  const [currentFlashcardPage, setCurrentFlashcardPage] = useState(0);
  const [flashcardPerPage, setFlashcardPerPage] = useState(4); //Default Rows Per Page
  const flashcardOptions = [4, 8, 12];
  const flashcardRange = useState(4);

  //Quiz Pagination
  const [currentQuizPage, setCurrentQuizPage] = useState(0);
  const [quizPerPage, setQuizPerPage] = useState(4); //Default Rows Per Page
  const quizOptions = [3, 6, 9];
  const quizRange = useState(3);

  const navigate = useNavigate();
  let { teacherID, classID, chapterID } = useParams();

  useEffect(() => {
    axios.get(`/api/teacher/class/${classID}/edit_chapter/${chapterID}`)
    .then(resp => {
      setChapterData(resp.data.chapter[0]);
      setFlashcards(resp.data.flashcards);
      setQuizzes(resp.data.quizzes);
      setFlashcardIncrement(Number(resp.data.flashcard_id[0]));
      setQuizIncrement(Number(resp.data.quiz_id[0]));

      setInitialChapterData(resp.data.chapter[0]);
      setInitialFlashcards(resp.data.flashcards);
      setInitialQuizzes(resp.data.quizzes);
      setInitialFlashcardIncrement(Number(resp.data.flashcard_id[0]));
      setInitialQuizIncrement(Number(resp.data.quiz_id[0]));
    }
    )
  }, [classID, chapterID]);

  //Determining number of pages and filtering rows of flashcard / quiz
  //Flashcard
  const flashcardCount = Math.ceil(flashcards.length / flashcardPerPage);
  const flashcardRowOffset = currentFlashcardPage * flashcardPerPage;
  //Quiz
  const quizCount = Math.ceil(quizzes.length / quizPerPage);
  const quizRowOffset = currentQuizPage * quizPerPage;

  const handleChange = (e, id) => {
    const { name, value } = e.target;
    switch(name){
      case "chapter-title":
        setChapterData({...chapterData, title: value});
        break;

      case "chapter-description":
        setChapterData({...chapterData, description: value})
        break;

      case "flashcard-title":
        const updatedFlashcardTitle = flashcards.map(flashcard => (
          flashcard.id === id ? {...flashcard, title : value} : flashcard
          )
        )
        setFlashcards(updatedFlashcardTitle);
        break;

      case "flashcard-content":
        const updatedFlashcardContent = flashcards.map(flashcard => (
          flashcard.id === id ? {...flashcard, content : value} : flashcard
          )
        )
        setFlashcards(updatedFlashcardContent);
        break;

      case "quiz-question":
        const updatedQuizQuestion = quizzes.map(quiz => (
          quiz.id === id ? {...quiz, question : value} : quiz
          )
        )
        setQuizzes(updatedQuizQuestion);
        break;

      case "quiz-answer":
        const updatedQuizAnswer = quizzes.map(quiz => (
          quiz.id === id ? {...quiz, answer : value} : quiz
          )
        )
        setQuizzes(updatedQuizAnswer);
        break;

      case "quiz-option1":
        const updatedQuizOption1 = quizzes.map(quiz => (
          quiz.id === id ? {...quiz, option1 : value} : quiz
          )
        )
        setQuizzes(updatedQuizOption1);
        break;

      case "quiz-option2":
        const updatedQuizOption2 = quizzes.map(quiz => (
          quiz.id === id ? {...quiz, option2 : value} : quiz
          )
        )
        setQuizzes(updatedQuizOption2);
        break;

      case "quiz-option3":
        const updatedQuizOption3 = quizzes.map(quiz => (
          quiz.id === id ? {...quiz, option3 : value} : quiz
          )
        )
        setQuizzes(updatedQuizOption3);
        break;

      default:
        break;
    }
  }

  const handleFlashcardRowChange = (e) => {
    setFlashcardPerPage(e.target.value)
  }

  const handleQuizRowChange = (e) => {
    setQuizPerPage(e.target.value)
  }

  const handleFlashcardPageChange = (e) => {
    setCurrentFlashcardPage(e.selected);
  };

  const handleQuizPageChange = (e) => {
    setCurrentQuizPage(e.selected);
  };

  const onAddFlashcard = () => {
    const newFlashcard = {
      id: (flashcardIncrement + 1).toString(), //Increment upon current max id in database
      title: '',
      content: '',
    }
    setFlashcardIncrement(prevState => prevState + 1);
    setFlashcards([...flashcards, newFlashcard])
  }

  const onAddQuiz = () => {
    const newQuiz = {
      id: (quizIncrement + 1).toString(),
      question: '',
      answer: '',
      option1: '',
      option2: '',
      option3: ''
    }
    setQuizIncrement(prevState => prevState + 1);
    setQuizzes([...quizzes, newQuiz])
  }
  
  const onRemoveFlashcard = (e, flashcardID) => {
      e.preventDefault();

      const updatedData = flashcards.filter(flashcard => 
          flashcard.id !== flashcardID
      )
      setFlashcards(updatedData);
      setFlashcardsToDelete(prevState => [...prevState, flashcardID]);
  }

  const onRemoveQuiz = (e, quizID) => {
      e.preventDefault();

      const updatedData = quizzes.filter(quiz => 
          quiz.id !== quizID
      )
      setQuizzes(updatedData);
      setQuizzesToDelete(prevState => [...prevState, quizID]);
  }

  const handleReset = (e) => {
    e.preventDefault();

    setChapterData(initialChapterData);
    setFlashcards(initialFlashcards);
    setQuizzes(initialQuizzes);
    setFlashcardIncrement(initialFlashcardIncrement);
    setQuizIncrement(initialQuizIncrement);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const sendFlashcardRemoveRequest = async () => {
      await axios.post("/api/teacher/remove_flashcard", {data: flashcardsToDelete})
      .catch(err => console.error(err));
    }

    const sendQuizRemoveRequest = async () => {
      await axios.post("/api/teacher/remove_quiz", {data: quizzesToDelete})
      .catch(err => console.error(err))
    }

    const sendPostRequest = async () => {
        await axios.post("/api/teacher/update_chapter", {
          id: chapterID,
          chapter: chapterData,
          flashcards: flashcards,
          quizzes: quizzes
        });
    };

    if (flashcardsToDelete.length > 0){
      sendFlashcardRemoveRequest();
    }

    if (quizzesToDelete.length > 0){
      sendQuizRemoveRequest();
    }

    //Backend: Send current users table to flask backend for saving
    sendPostRequest();
    navigate("/teacher/" + teacherID + "/class/" + classID);
  }

  return (
    <section className='Container'>
      <form onSubmit={handleSubmit}>
        <h2 className='title'>
          <FontAwesomeIcon icon="fa-solid fa-pen" />
            Edit Chapter
        </h2>
          <div className='input-container'>
            <Input 
              label={"Chapter Title"}
              type={"text"}
              name={"chapter-title"}
              placeholder={"Insert Title Here..."}
              required={true}
              defaultValue={chapterData.title}
              handleInput={(e) => handleChange(e, null)}
            />
            <Input 
              label={"Description"}
              type={"text"}
              name={"chapter-description"}
              placeholder={"Insert Description Here..."}
              required={true}
              defaultValue={chapterData.description}
              handleInput={(e) => handleChange(e, null)}
            />
          </div>

        <div className='input-container'>
          <h2 className='label-text'>Flashcard</h2>
          <FlashcardList 
            flashcards={flashcards.slice(flashcardRowOffset, flashcardRowOffset + flashcardPerPage)} 
            onAddFlashcard={onAddFlashcard}
            onRemoveFlashcard={onRemoveFlashcard}
            handleInput={handleChange}
          />
          <Pagination 
            options={flashcardOptions}
            pageCount={flashcardCount}
            pageRange={flashcardRange}
            handleRowChange={handleFlashcardRowChange}
            handlePageChange={handleFlashcardPageChange}
          />
        </div>
        <div className='input-container'>
          <h2 className='label-text'>Quiz</h2>
          <QuizList 
            quizzes={quizzes.slice(quizRowOffset, quizRowOffset + quizPerPage)} 
            onAddQuiz={onAddQuiz}
            onRemoveQuiz={onRemoveQuiz}
            handleInput={handleChange}
          />
          <Pagination 
            options={quizOptions}
            pageCount={quizCount}
            pageRange={quizRange}
            handleRowChange={handleQuizRowChange}
            handlePageChange={handleQuizPageChange}
          />
        </div>

        <div className='button-container'>
          <button className="submit-button" type='submit'>Update</button>
          <button className="reset-button" type='reset' onClick={handleReset}>Reset</button>
        </div>
      </form>
    </section>

  )
}

export default EditChapter