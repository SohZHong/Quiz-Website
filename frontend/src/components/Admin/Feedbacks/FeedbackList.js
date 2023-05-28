// App.js
import React, { useEffect, useState } from "react";
import FeedbackTable from "./FeedbackTable";
import Pagination from "../../addon/Pagination";
import Input from "../../addon/Input";
import axios from "axios";

function FeedbackList({getFeedbacks, user:{id}}) {
    const [feedbacks, setFeedbacks] = useState([]);
    //Setting state for search queries
    const [search, setSearchQuery] = useState("");
    //Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10); //Default Rows Per Page
    const tableOptions = [10, 20, 30];
    const pageRange = useState(10);

    //load SQL data
    useEffect(() => {

        axios.get(`/api/admin/${id}`)
          .then(resp => {
            const data = resp.data.feedback.map(row => {
                return {
                    id: row[0].toString(),
                    title: row[1],
                    name: row[2],
                    email: row[3],
                    content: row[4],
                    posted: row[5],
                    read: row[6].toString()
                };
            });
            setFeedbacks(data)
          }) 
          .catch(err => console.error(err));
    }, [id]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value)
    }

    const handleSelect = (e) => {
        const sortedFeedbacks = [...feedbacks];
        const selection = e.target.value;

        sortedFeedbacks.sort((current, next) => {
    
            const date1 = new Date(current.posted);
            const date2 = new Date(next.posted);

            if (selection === 'recent'){
                //Convert to date object for subtraction, if result is positive, current comes before next
                return (date2 - date1)
            }
            else if (selection === 'unread'){
                if (current.read === '0'){
                    return  -1 //current feedback will come before next post
                }
                else if (current.read === next.read){
                    return 0 //Remain same order
                }
                else{
                    return 1 //next feedback arranged to come before current
                }
            }
            else {
                return (date1 - date2)
            }
        });

        setFeedbacks(sortedFeedbacks);
    }

    const handleRowChange = (e) => {
        setRowsPerPage(e.target.value)
    }

    const filteredFeedbacks = 
        feedbacks.filter((feedback) => {
            //Check if user key values matches search query
            return Object.values(feedback).some((key) =>
                    key.toLowerCase().includes(search.toLowerCase())
            );
    })

    //Determining number of pages and filtering rows
    const pageCount = Math.ceil(filteredFeedbacks.length / rowsPerPage);
    const rowOffset = currentPage * rowsPerPage;

    const handlePageChange = (e) => {
        setCurrentPage(e.selected);
    };

    const onClickFeedback = (feedbackID) => {
        //Loop through feedbacks and change the matching ID's status to read
        const updatedData = feedbacks.map(feedback => {
            if (feedback.id === feedbackID && feedback.read !== '1'){

                axios.post('/api/admin/save_feedback', { id: feedback.id})

                return {...feedback, read: '1'}
            }
            else {
                return feedback //Otherwise return as is
            }
        });
        setFeedbacks(updatedData);
    }

    const onDeleteFeedback = (feedbackID) => {
        const sendRemoveRequest = async () => {
            await axios.post(`/api/admin/delete_feedback/${feedbackID}`).catch((err) =>
                console.error(err)
            );
        };
      
        const updatedData = feedbacks.filter(
            (feedback) => feedback.id !== feedbackID
        );
        
        sendRemoveRequest();
        setFeedbacks(updatedData);
    };
      
    // useEffect to execute callback after feedbacks state is updated
    useEffect(() => {
        getFeedbacks(feedbacks);
    }, [feedbacks, getFeedbacks]);

    return (
        
        <div className='feedback-container'>
            
            <div className="table-options">

                <Input
                    label={""}
                    type={"text"}
                    name={"search"}
                    placeholder={"Search Feedbacks..."}
                    required={false}
                    defaultValue={search}
                    handleInput={(e) => handleSearch(e)}
                />

                <div className="filter-button">
                    <select onChange={handleSelect}>
                        <option value={''}>Default</option>
                        <option value={'recent'}>Most Recent</option>
                        <option value={'unread'}>Unread</option>
                        <option value={'oldest'}>Oldest</option>
                    </select>
                </div>

            </div>

            <div className='table-container'>
                <FeedbackTable 
                    feedbacks={filteredFeedbacks.slice(rowOffset, rowOffset + rowsPerPage)}
                    onClickFeedback={onClickFeedback}
                    onDeleteFeedback={onDeleteFeedback}
                />
            </div>
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
export default FeedbackList