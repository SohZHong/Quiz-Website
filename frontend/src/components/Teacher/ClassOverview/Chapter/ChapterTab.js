import React, { useState } from 'react';
import Chapter from './Chapter';
import Pagination from '../../../addon/Pagination';

function ChapterTab({ chapters, onEditChapter, onDeleteChapter }) {

    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10); //Default Rows Per Page
    const chapterOptions = [10, 15, 20];
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
        <React.Fragment>
            <div className="chapter-list">
            {chapters.slice(rowOffset, rowOffset + rowsPerPage).map((chapter) => {
                return (
                <Chapter
                    key={chapter.id}
                    chapter={chapter}
                    onEditChapter={onEditChapter}
                    onDeleteChapter={onDeleteChapter}
                />
                );
            })}
            </div>
            <Pagination
                options={chapterOptions}
                pageCount={pageCount}
                pageRange={pageRange}
                handleRowChange={handleRowChange}
                handlePageChange={handlePageChange}
            />
        </React.Fragment>

      );
    }
    
    export default ChapterTab;