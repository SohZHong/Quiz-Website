import React, { useEffect, useState } from 'react';
import ChapterTab from './Chapter/ChapterTab';
import MemberTab from './Member/MemberTab';
import ProgressTab from './Progress/ProgressTab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './ClassOverview.scss';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditClassModal from './EditClassModal/EditClassModal';
import Dropdown from 'react-bootstrap/Dropdown'
import UploadsTab from './Uploads/UploadsTab';
import ExamTab from './Exam/ExamTab';

function ClassOverview() {
    const [classInfo, setClassInfo] = useState({});
    const [exam, setExam] = useState({});
    const [chapters, setChapters] = useState([]);
    const [members, setMembers] = useState([]);
    const [completedChapters, setCompletedChapters] = useState([]);
    const [completedExams, setCompletedExams] = useState([]);
    const [tab, setTab] = useState('Chapters');
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    let { teacherID, classID } = useParams();
    useEffect(() => {
        axios.get(`/api/teacher/${teacherID}/class/${classID}`)
            .then(resp => {
                setClassInfo(resp.data.class[0]);
                setExam(resp.data.exam[0])

                let chapterData = resp.data.progress;
                let memberData = resp.data.members;
                let examProgressData = resp.data.exam_progress;

                const completedChapters = [];
                //Iterating chapter data to find which students have completed the respective chapters
                chapterData.forEach((chapter) => {
                  const chapterID = chapter.id;
                  const studentID = chapter.student_id;
                  
                  const completedMember = memberData.find((member) => member.id === studentID);
                  
                  if (completedMember) {
                    completedChapters.push({
                      id: completedMember.id,
                      name: completedMember.name,
                      chapter_id: chapterID,
                    });
                  }
                });

                //Calculate students who completed chapters
                const combinedData = chapterData.reduce((acc, chapter) => {
                    //Iterating current chapter instance to check if exist in current array
                    const existingChapter = acc.find(c => c.id === chapter.id);
                    const total = memberData.length;

                    if (existingChapter) {
                      existingChapter.completed += 1;
                    } else {
                      const matchingMembers = memberData.filter(m => m.id === chapter.student_id);
                      const completed = matchingMembers.length;
                      
                      acc.push({
                        id: chapter.id,
                        title: chapter.title,
                        description: chapter.description,
                        completed: completed,
                        total: total
                      });
                    }
                    return acc;
                }, []);

                //Adding chapters with no progress
                chapterData.forEach((chapter) => {
                    const existingChapter = combinedData.find(c => c.id === chapter.id);
                    if (!existingChapter) {
                      combinedData.push({
                        id: chapter.id,
                        title: chapter.title,
                        description: chapter.description,
                        completed: 0,
                        total: memberData.length
                      });
                    }
                });

                //Sort chapters by their creation date / id
                combinedData.sort((a, b) => a.id - b.id);
                
                //Determining students who finished exams and their score
                const completedExams = []
                memberData.forEach((member) => {
                    const studentID = member.id;
                    
                    const completedExam = examProgressData.find((data) => data.student_id === studentID);
                    
                    if (completedExam) {
                      completedExams.push({
                        id: completedExam.student_id,
                        name: member.name,
                        score: completedExam.score,
                      });
                    }
                });
                setChapters(combinedData);
                setMembers(memberData);
                setCompletedChapters(completedChapters);
                setCompletedExams(completedExams);
            })
            .catch(err => console.error(err))
    }, [teacherID, classID])

    const handleClick = (e) => {
        e.preventDefault();
        const newActiveTab = e.target.getAttribute('data-tab');
        setTab(newActiveTab);
    };

    const onEditChapter = (chapterID) => {
        navigate(`edit_chapter/${chapterID}`);
    }

    const onDeleteChapter = (chapterID) => {
        const sendRemoveRequest = async () => {
            await axios.post('/api/teacher/remove_chapter', {data: {chapterID}})
        }

        const updatedData = chapters.filter(chapter => (
            chapter.id !== chapterID && {...chapter, chapter}
        ))

        setChapters(updatedData)
        sendRemoveRequest();
    }

    const onClickMember = (e, studentID) => {
        e.preventDefault();
        navigate(`/profile/student/${studentID}`);
    }

    const onDeleteMember = (studentID) => {
        //Loop through members and delete based on member and class id
        const sendRemoveRequest = async () => {
            await axios.post('/api/teacher/remove_member', {data: {studentID, classID}})
        }

        const updatedData = members.filter(member => (
            member.id !== studentID && {...member, member}
        ))
        setMembers(updatedData);
        sendRemoveRequest();
    }

    const onDeleteClass = () => {
        const sendRemoveRequest = async () => {
            let id = teacherID;
            await axios.post('/api/teacher/delete_class', {data: {id, classID}})
        }

        sendRemoveRequest();
        navigate("/teacher/" + teacherID);
    }

    const onEditExam = (e, examID) => {
        e.preventDefault();
        navigate(`edit_exam/${examID}`);
    }

    const onDeleteExam = (examID) => {
        const sendRemoveRequest = async () => {
            await axios.post('/api/teacher/remove_exam', {id: examID})
        }
        sendRemoveRequest();
        window.location.reload();
    }

    const handleOpenModal = (e) => {
        e.preventDefault();
        setIsOpen(true);
    }

    const handleCloseModal = (e) => {
        e.preventDefault();
        setIsOpen(false);
    }

    const handleAddChapter = (e) => {
        e.preventDefault();

        navigate("add_chapter");
    }

    const handleAddExam = (e) => {
        e.preventDefault();

        navigate("add_exam");
    }
    return (
    <React.Fragment>
        <EditClassModal 
            class={classInfo} 
            isOpen={isOpen}
            onClose={handleCloseModal} 
        />
        <section className="Container">
            <div className="header">
            <div className="title">
                <FontAwesomeIcon icon="fa-solid fa-chalkboard-user" />
                <h3>{classInfo.name}</h3>
            </div>
                <Dropdown align="start">
                    <Dropdown.Toggle className='dark-button'>
                        <FontAwesomeIcon icon="fa-solid fa-ellipsis" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className='dropdown-link'>
                        <Dropdown.Item onClick={handleOpenModal}><FontAwesomeIcon icon="fa-solid fa-pen"/>Edit Class</Dropdown.Item>   
                        <Dropdown.Item onClick={handleAddChapter}><FontAwesomeIcon icon="fa-solid fa-folder-plus" />Add Chapter</Dropdown.Item>
                        <Dropdown.Item 
                            onClick={handleAddExam}
                            disabled={typeof exam !== 'undefined'}
                            style={{
                                pointerEvents: typeof exam !== 'undefined' ? 'none' : 'auto',
                                filter: typeof exam !== 'undefined' ? 'brightness(0.7)' : 'none'
                            }}
                        >
                            <FontAwesomeIcon icon="fa-solid fa-clipboard-list" />Add Exam
                        </Dropdown.Item>
                        <Dropdown.Divider />

                        <Dropdown.Item onClick={onDeleteClass} className='danger-option'><FontAwesomeIcon icon="fa-solid fa-trash" />Remove Class</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div className="content">
            <div className="class-section">
                <button
                    data-tab="Chapters"
                    className={tab === 'Chapters' ? 'active' : 'disable'}
                    onClick={handleClick}
                >
                Chapters
                </button>
                <button
                    data-tab="Members"
                    className={tab === 'Members' ? 'active' : 'disable'}
                    onClick={handleClick}
                >
                Members
                </button>
                <button
                    data-tab="Progress"
                    className={tab === 'Progress' ? 'active' : 'disable'}
                    onClick={handleClick}
                >
                Progress
                </button>
                <button
                    data-tab="Uploads"
                    className={tab === 'Uploads' ? 'active' : 'disable'}
                    onClick={handleClick}
                >
                Uploads
                </button>
                <button
                    data-tab="Exam"
                    className={tab === 'Exam' ? 'active' : 'disable'}
                    onClick={handleClick}
                    disabled={typeof exam === 'undefined'}
                    style={{ pointerEvents: typeof exam === 'undefined' ? 'none' : 'auto' }}
                >
                Exam
                </button>
            </div>
                {tab === 'Chapters' && 
                    <ChapterTab 
                        chapters={chapters} 
                        onEditChapter={onEditChapter}
                        onDeleteChapter={onDeleteChapter}
                    />
                }
                {tab === 'Members' && 
                    <MemberTab 
                        classInfo={classInfo} 
                        members={members} 
                        onClickMember={onClickMember}
                        onDeleteMember={onDeleteMember}
                    />
                }
                {tab === 'Progress' && 
                    <ProgressTab 
                        chapters={chapters}
                        members={members}
                        completedChapters={completedChapters} 
                    />
                }
                {tab === 'Uploads' && 
                    <UploadsTab
                        classID={classID}
                    />
                }
                {tab === 'Exam' && 

                    <ExamTab
                        exam={exam}
                        members={members}
                        completedExams={completedExams}
                        onEditExam={onEditExam}
                        onDeleteExam={onDeleteExam}
                    />
                }
            </div>
        </section>
    </React.Fragment>
    );
}

export default ClassOverview;