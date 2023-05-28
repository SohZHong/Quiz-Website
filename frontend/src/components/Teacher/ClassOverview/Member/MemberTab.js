import React, { useState } from 'react';
import Member from './Member';
import Pagination from '../../../addon/Pagination';
import Input from '../../../addon/Input';

function MemberTab({classInfo:{ code }, members, onClickMember, onDeleteMember}) {
  const [search, setSearchQuery] = useState("");
  //Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); //Default Rows Per Page
  const memberOptions = [10, 20, 30];
  const pageRange = useState(10);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleRowChange = (e) => {
      setRowsPerPage(e.target.value)
  }

  const filteredMembers = 
      members.filter((member) => {
          //Check if user key values matches search query
          return Object.values(member).some((key) => {
            let searchKey = key != null ? key.toString() : 'null';
              return searchKey.toLowerCase().includes(search.toLowerCase())
          }
          );
  })

  //Determining number of pages and filtering rows
  const pageCount = Math.ceil(filteredMembers.length / rowsPerPage);
  const rowOffset = currentPage * rowsPerPage;

  const handlePageChange = (e) => {
      setCurrentPage(e.selected);
  };

  return (
    <div className='member-section'>
      <div className='member-invite'>
        <h2>Invite your students with this join code</h2>
        <h1>{code}</h1>
      </div>

      <h2 className='label-text'>Members</h2>
      <div className='member-list'>
        <Input 
          label={""}
          type={"text"}
          name={"search"}
          placeholder={"Search Members..."}
          required={false}
          defaultValue={search}
          handleInput={(e) => handleSearch(e)}
        />

        {filteredMembers.slice(rowOffset, rowOffset + rowsPerPage).map(member => 
            <Member
              key={member.id}
              member={member}
              onClickMember={onClickMember}
              onDeleteMember={onDeleteMember}
            />
          )
        }
      </div>
      <Pagination 
        options={memberOptions}
        pageCount={pageCount}
        pageRange={pageRange}
        handleRowChange={handleRowChange}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default MemberTab;
