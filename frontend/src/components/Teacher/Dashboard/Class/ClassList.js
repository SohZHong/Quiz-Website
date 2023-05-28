// App.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClassTable from "./ClassTable";
import Pagination from "../../../addon/Pagination";
import Input from "../../../addon/Input";
import axios from "axios";

function ClassList({teacherID, getClasses}) {
    const [classes, setClasses] = useState([]);
    //Setting state for search queries
    const [search, setSearchQuery] = useState(""); 
    //Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10); //Default Rows Per Page
    const tableOptions = [5, 10, 15];
    const pageRange = useState(10);
    const navigate = useNavigate();

    //load SQL data
    useEffect(() => {
        axios.get(`/api/teacher/${teacherID}`)
          .then(resp => setClasses(resp.data.classes))
          .catch(err => console.error(err));
      }, [teacherID]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value)
    }

    const handleSelect = (e) => {
        const sortedClasses = [...classes]; //Copy to not mutate array
        const selection = e.target.value;

        sortedClasses.sort((current, next) => {
            
            const date1 = new Date(current.created);
            const date2 = new Date(next.created);

            if (selection === 'recent'){
                //Convert to date object for subtraction, if result is positive, current comes before next
                return (date2 - date1)
            }
            else {
                return (date1 - date2)
            }
        });

        setClasses(sortedClasses);
    }

    const handleRowChange = (e) => {
        setRowsPerPage(e.target.value)
    }

    const handlePageChange = (e) => {
        setCurrentPage(e.selected);
    };

    //Filter tables for easy searching
    const filteredClasses = 
        classes.filter((group) => {
            //Check if user key values matches search query
            return Object.values(group).some((key) => 
                key.toString().toLowerCase().includes(search.toLowerCase())
            );
    })

    //Determining number of pages and filtering rows
    const pageCount = Math.ceil(filteredClasses.length / rowsPerPage);
    const rowOffset = currentPage * rowsPerPage;

    const onVisitClass = (classID) => {
        
        const id = parseInt(classID);

        //Fake file path, change it to legit one later
        const filePath = "/teacher/" + teacherID + "/class/" + id;

        // setLink(filePath);
        navigate(filePath);
    }

    const onDeleteClass = (classID) => {
        const sendDeleteRequest = async () => {
            await axios.post(`/api/teacher/delete_class`, {data: {teacherID, classID}})
        }

        //Achieve remove action by not adding it into new array
        const updatedList = classes.filter(group => (
                group.id !== classID && {...group, group}
            )
        )
        setClasses(updatedList);
        sendDeleteRequest();
    }

    //Send the class count to dashboard
    useEffect(() => {
        getClasses(classes)
    }, [classes, getClasses])
    
    return (
        
        <div className='class-container'>
            
            <div className="table-options">
                <Input 
                    label={""}
                    type={"text"}
                    name={"search"}
                    placeholder={"Search Classes..."}
                    required={false}
                    defaultValue={search}
                    handleInput={(e) => handleSearch(e)}
                />
                <div className="filter-button">
                    <select onChange={handleSelect}>
                        <option value={''}>Default</option>
                        <option value={'recent'}>Most Recent</option>
                        <option value={'oldest'}>Oldest</option>
                    </select>
                </div>
            </div>

            <form className='table-container'>
                <ClassTable 
                    classes={filteredClasses.slice(rowOffset, rowOffset + rowsPerPage)} 
                    onVisitClass={onVisitClass}
                    onDeleteClass={onDeleteClass}
                />
            </form>
            <Pagination 
                options={tableOptions}
                pageCount={pageCount}
                pageRange={pageRange}
                handleRowChange={handleRowChange}
                handlePageChange={handlePageChange}
            />
        </div>

    );
}

export default ClassList