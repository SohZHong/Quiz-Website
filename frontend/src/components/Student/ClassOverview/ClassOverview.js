import React, { useState, useEffect } from 'react';
import'./ClassOverview.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Leaderboard from './Leaderboard/Leaderboard';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ChapterList from './Chapter/ChapterList';
import UploadList from './Upload/UploadList';
import Exam from './Exam/Exam';

function StudentClassOverview(){
    const [classInfo, setClassInfo] = useState({});
    const [chapters, setChapters] = useState([]);
    const [files, setFiles] = useState([]);
    const [exam, setExam] = useState({});
    const [tab, setTab] = useState('Chapters');
    const navigate = useNavigate();

    let { studentID, classID } = useParams();
    useEffect(() => {
        axios.get(`/api/student/${studentID}/class/${classID}`)
            .then(resp => {
                let classData = resp.data.classInfo[0];
                let chapterData = resp.data.chapters;
                let progressData = resp.data.progress;
                let examData = resp.data.exam[0];

                const chapterObjs = chapterData.map(chapter => {
                    //Iterate through progress array to find if student completed the chapter
                    const progressObj = progressData.find(progress => progress.id === chapter.id);
                    return {
                        ...chapter,
                        progression: progressObj ? progressObj.progress === 1 : false
                    }
                })

                setClassInfo(classData);
                setChapters(chapterObjs);
                setExam(examData);
            })
            .catch(err => console.error(err))

        axios.get(`/api/class/${classID}/get_uploads`)
        .then(resp => setFiles(resp.data))
        .catch(err => console.error(err))

    }, [studentID, classID])

    const handleClick = (e) => {
        e.preventDefault();
        const newActiveTab = e.target.getAttribute('data-tab');
        setTab(newActiveTab);
    };

    const handleReturn = (e) => {
        e.preventDefault();
        navigate(-1);
    }

    return (
        <section className='Container'>
            <div className='class_header'>
                <div className='class-header-wrapper'>
                    <h1 className='class_name'>{classInfo.name}</h1>
                    <h4 className='class_description'>{classInfo.description}</h4>
                </div>
                <button className='return-button' onClick={handleReturn}>
                    <FontAwesomeIcon icon="fa-solid fa-arrow-left"/>
                    <span>Return</span>
                </button>
            </div>
            <div className='class-wrapper'>
                <div className ="class_container">
                    <div className='class-navigator'>
                    <button
                        data-tab="Chapters"
                        className={tab === 'Chapters' ? 'active' : 'disable'}
                        onClick={handleClick}
                    >
                    Chapters
                    </button>
                    <button
                        data-tab="Files"
                        className={tab === 'Files' ? 'active' : 'disable'}
                        onClick={handleClick}
                    >
                    Files
                    </button>
                    <button
                        data-tab="Exam"
                        className={tab === 'Exam' ? 'active' : 'disable'}
                        onClick={handleClick}
                    >
                    Exam
                    </button>
                    </div>
                    {tab === 'Chapters' && 
                        <ChapterList
                            studentID={studentID}
                            classID={classID}
                            chapters={chapters}
                        />
                    }
                    {tab === 'Files' && 
                        <UploadList
                            files={files}
                        />
                    }
                    {tab === 'Exam' && 
                        <Exam
                            exam={exam}
                        />
                    }

                </div>
                <Leaderboard classID={classID}/> 
            </div>
        </section>

      );
      }

    
  

export default StudentClassOverview;