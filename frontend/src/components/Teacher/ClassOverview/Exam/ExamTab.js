import React, { useState } from 'react';
import Pagination from '../../../addon/Pagination';
import ExamProgress from './ExamProgress';
import ProgressBar from '../../../addon/ProgressBar';
import PromptButton from '../../../addon/PromptButton';

function ExamTab({exam: {id, posted}, members, completedExams, onEditExam, onDeleteExam }) {

    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isOpen, setIsOpen] = useState(false);
    const examOptions = [10, 15, 20];
    const pageRange = useState(10);

    const handleRowChange = (e) => {
        setRowsPerPage(e.target.value)
    }

    //Determining number of pages and filtering rows
    const pageCount = Math.ceil(members.length / rowsPerPage);
    const rowOffset = currentPage * rowsPerPage;

    const handlePageChange = (e) => {
        setCurrentPage(e.selected);
    };
    
    const handleConfirmDelete = (confirmed) => {
        if (confirmed){
          onDeleteExam(id);
        }
      };
  
      const handleOpenPrompt = (e) => {
          e.preventDefault();
          setIsOpen(true);
      };
        
        const handleClosePrompt = (e) => {
          e.preventDefault();
          setIsOpen(false);
      }

    // Counters for students below and above the pass mark
    let belowPassMarks = 0;
    let abovePassMarks = 0;
    completedExams.forEach((student) => {
        if (student.score < 40) {
          belowPassMarks++;
        } else {
          abovePassMarks++;
        }
    });

    const completionCount = completedExams.length;
    const completionPercentage = parseInt((completionCount)/(members.length)*100);
    const passPercentage = parseInt(abovePassMarks/completionCount*100);
    const failedPercentage = parseInt(belowPassMarks/completionCount*100);

    return (
        <React.Fragment>
            <PromptButton 
                message={"Are you sure you want to proceed? All exam data will be lost!"}
                confirmText={"Confirm"}
                cancelText={"Cancel"}
                confirmAction={handleConfirmDelete}
                isOpen={isOpen}
                onClose={handleClosePrompt}
            />
            <div className='exam-section'>
                <div className='exam-report-container'>
                    <div className='exam-report-header'>
                        <span className='posted-date'>Posted: {posted}</span>
                        <div className='exam-button-container'>
                            <button className='edit-button' onClick={(e) => onEditExam(e, id)}>Edit</button>
                            <button className='delete-button' onClick={handleOpenPrompt}>Delete</button>
                        </div>
                    </div>
                    <div className='exam-progress-container'>
                        <h4 className='progress-count'>{completionCount} Students Attempted</h4>
                        <div className='exam-progress-wrapper'>
                            <div className='percentage total'>
                                <h1>Total Completed</h1>
                                <h3>{completionPercentage}%</h3>
                            </div>
                            <ProgressBar completion={completionPercentage}/>
                        </div>
                        <div className='exam-progress-wrapper'>
                            <div className='percentage pass'>
                                <h1>Passed</h1>
                                <h3>{passPercentage}%</h3>
                            </div>
                            <ProgressBar completion={passPercentage}/>
                        </div>
                        <div className='exam-progress-wrapper'>
                            <div className='percentage fail'>
                                <h1>Failed</h1>
                                <h3>{failedPercentage}%</h3>
                            </div>
                            <ProgressBar completion={failedPercentage}/>
                        </div>
                    </div>
                </div>
                <ExamProgress
                    members={members.slice(rowOffset, rowOffset + rowsPerPage)}
                    completedExams={completedExams}
                />
                <Pagination
                    options={examOptions}
                    pageCount={pageCount}
                    pageRange={pageRange}
                    handleRowChange={handleRowChange}
                    handlePageChange={handlePageChange}
                />
            </div>
        </React.Fragment>

      );
    }
    
export default ExamTab;