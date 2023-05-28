import React from "react";
import ReactPaginate from 'react-paginate';
import TableFilter from "./TableFilter";

function Pagination({options, pageCount, pageRange, handleRowChange, handlePageChange}) {

    const handleSelect = (e) => {
        handleRowChange(e)
    }

    const handlePageClick = (e) => {
        handlePageChange(e);
    };

    return (
        <div className="pagination-container">
        <TableFilter 
            options={options}
            onSelect={handleSelect}
        />

        <ReactPaginate
            previousLabel={'<'}
            nextLabel={'>'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={pageRange}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
        />
        </div>
    );
    }
export default Pagination