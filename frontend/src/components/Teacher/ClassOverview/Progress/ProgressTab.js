import React, { useState } from 'react';
import ChapterProgress from './ChapterProgress.js';
import Pagination from '../../../addon/Pagination.js';


function ProgressTab({ chapters, members, completedChapters }) {
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(1); //Only show one per page
    const progressOptions = [1, 3, 5];
    const pageRange = useState(10);
  
    const handleRowChange = (e) => {
        setRowsPerPage(e.target.value)
    }
  
    //Determining number of pages and filtering rows
    const pageCount = Math.ceil(chapters.length / rowsPerPage);
    const rowOffset = currentPage * rowsPerPage;
  
    const handlePageChange = (e) => {
        setCurrentPage(e.selected);
    };

    return (
      <div className='progress-section'>
        {chapters.slice(rowOffset, rowOffset + rowsPerPage).map((chapter) => (
          <ChapterProgress
            key={chapter.id}
            chapter={chapter}
            members={members}
            completedChapters={completedChapters}
          />
        ))}
        <Pagination 
            options={progressOptions}
            pageCount={pageCount}
            pageRange={pageRange}
            handleRowChange={handleRowChange}
            handlePageChange={handlePageChange}
        />
      </div>
    );
  };
  
  export default ProgressTab;