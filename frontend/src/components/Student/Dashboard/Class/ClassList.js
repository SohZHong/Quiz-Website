// App.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClassTable from "./ClassTable";
import Pagination from "../../../addon/Pagination";
import Input from "../../../addon/Input";
import axios from "axios";

function ClassList({ studentID, getClasses }) {
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

        axios.get(`/api/student/${studentID}/get_classes`)
          .then(resp => {
            const classData = resp.data.classes;
            const completionData = resp.data.completion;
    
            const classList = classData.map(classObj => {
                //Match completion data to class id
                const completionCount = completionData.find(completion => completion.id === classObj.id);
                const completePercentage = Number((completionCount.completion_count / classObj.chapter_count) * 100).toFixed(0); //Remove decimal places and parse to String
                //Add a new key which represents completion data in class
                return ({
                    id: classObj.id,
                    name: classObj.name,
                    joined: classObj.joined,
                    completion: isNaN(completePercentage) ? 0 : completePercentage //Prevent Nan when 0 is involved
                });
            })
            setClasses(classList);
          })
          .catch(err => console.error(err));
    }, [studentID]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value)
    }

    const handleSelect = (e) => {
        const sortedClasses = [...classes]; //Copy to not mutate array
        const selection = e.target.value;

        sortedClasses.sort((current, next) => {
            
            //Month argument starts from 0, so need subtract 1
            const date1 = new Date(current.joined);
            const date2 = new Date(next.joined);

            if (selection === 'recent'){
                //Convert to date object for subtraction, if result is positive, current comes before next
                return (date2 - date1)
            }//recent, complte, incomplete, oldest
            else if (selection === 'most'){
                return (next.completion - current.completion)
            }
            else if (selection === 'least'){
                return (current.completion - next.completion)
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
        const filePath = "class/" + id;

        // setLink(filePath);
        navigate(filePath);
    }

    const onLeaveClass = (classID) => {

        const sendRemoveRequest = async() => {
            axios.post("/api/leave_class", {data: {studentID, classID }})
            .catch(err => console.error(err))
        }

        //Filter results
        //Achieve remove action but not adding it into new array
        const updatedList = classes.filter(group => (
                group.id !== classID && {...group, group}
            )
        )
        setClasses(updatedList);
        sendRemoveRequest();
    }

    //Send the feedback count to dashboard everytime class is deleted
    useEffect(() => {
        getClasses(classes)
    }, [classes, getClasses])

    return (
        
        <div className='class-container'>
            
            <div className="table-options">
                <Input 
                    label={""}
                    name={"search"}
                    type={"text"}
                    placeholder={"Search Classes..."}
                    defaultValue={search}
                    handleInput={handleSearch}
                    required={false}
                />
                <div className="filter-button">
                    <select onChange={handleSelect}>
                        <option value={''}>Default</option>
                        <option value={'recent'}>Most Recent</option>
                        <option value={'most'}>Most Progress</option>
                        <option value={'least'}>Least Progress</option>
                        <option value={'oldest'}>Oldest</option>
                    </select>
                </div>
            </div>

            <form className='table-container'>
                <ClassTable 
                    classes={filteredClasses.slice(rowOffset, rowOffset + rowsPerPage)} 
                    onVisitClass={onVisitClass}
                    onLeaveClass={onLeaveClass}
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