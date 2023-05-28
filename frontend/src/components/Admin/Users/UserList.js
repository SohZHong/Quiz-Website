// App.js
import React, { useEffect, useState } from "react";
import UserTable from "./UserTable";
import Pagination from "../../addon/Pagination";
import axios from "axios";
import Input from "../../addon/Input";

function UserList({getUsers, user:{id}}) {
    const [users, setUsers] = useState([]);
    const [usersToDelete, setUsersToDelete] = useState([]);
    //Initial state for user table
    const [initialUsers, setInitialUsers] = useState([]);
    //SQL Auto-Increment Value
    const [userIncrement, setUserIncrement] = useState(0);
    const [initialUserIncrement, setInitialUserIncrement] = useState(0);
    const [adminIncrement, setAdminIncrement] = useState(0);
    const [initialAdminIncrement, setInitialAdminIncrement] = useState(0);
    //Setting state for search queries
    const [search, setSearchQuery] = useState(""); 
    //Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5); //Default Rows Per Page
    const tableOptions = [5, 10, 20];
    const pageRange = useState(5);

    
    // load SQL data
    useEffect(() => {
        axios.get(`/api/admin/${id}`)
          .then(resp => {

            const userIncrementValue = parseInt(resp.data.userIncrement);
            const adminIncrementValue = parseInt(resp.data.adminIncrement);

            const data = resp.data.user.map(row => {
                return {
                    id: row[0].toString(),
                    name: row[1],
                    password: row[2],
                    email: row[3],
                    type: row[4],
                    registration: row[5],
                    status: row[6].toString(),
                    admin_id: row[7] === null ? "null" : row[7].toString()
                };
            });
            setUsers(data);
            setInitialUsers(data);
            setUserIncrement(userIncrementValue);
            setAdminIncrement(adminIncrementValue);
            setInitialUserIncrement(userIncrementValue);
            setInitialAdminIncrement(adminIncrementValue);
          })
          .catch(err => console.error(err));

      }, [id]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value)
    }

    const handleRowChange = (e) => {
        setRowsPerPage(e.target.value)
    }

    const handlePageChange = (e) => {
        setCurrentPage(e.selected);
    };

    //Filter tables for easy searching
    const filteredUsers = 
        users.filter((user) => {
            //Check if user key values matches search query
            return Object.values(user).some((key) =>
                    key.toLowerCase().includes(search.toLowerCase())
            );
    })

    //Determining number of pages and filtering rows
    const pageCount = Math.ceil(filteredUsers.length / rowsPerPage);
    const rowOffset = currentPage * rowsPerPage;

    //Overwrite current table with updated table results
    const onEditTable = (e, userID) => {
        //Getting input field value
        const { name, value } = e.target

        const updatedTable = users.map(user => (
                //if user id in current array matches edited user id, overwrite data else remain same
                user.id === userID && name ? {...user, [name] : value} : user
            )
        )

        setUsers(updatedTable);
    }

    const onDisableUser = (userID) => {
        const updatedTable = users.map(user => {
                //Toggle user activation
                let activation = user.status === '0' ? '1' : '0';

                return user.id === userID ? {...user, status : activation} : user
            }
        )
        setUsers(updatedTable)
    }

    const onDeleteUser = (userID) => {

        const deletedUser = users
        .filter(user => user.id === userID)
        .map((user) => ({ id: user.id, type: user.type.toLowerCase() }));

        const updatedData = users.filter(
            user => user.id !== userID
        );
        setUsersToDelete((prevUsersToDelete) => [...prevUsersToDelete, ...deletedUser]);
        setUsers(updatedData);
    }

    const addAdmin = () => {

        const incrementedUserIncrement = userIncrement + 1;
        const incrementedAdminIncrement = adminIncrement + 1;

        const newRowInputs = {
            //Increment upon largest user id, prevents ID conflicts
            id: incrementedUserIncrement.toString(),
            name: 'Admin',
            password: 'admin12345',
            email: 'newadmin@gmail.com',
            type: 'Admin',
            registration: new Date().toUTCString(),
            admin_id: incrementedAdminIncrement.toString(),
            status: '1'
        }

        //Update the increment value in state
        setUserIncrement(incrementedUserIncrement);
        setAdminIncrement(incrementedAdminIncrement);

        setUsers([...users, newRowInputs])
    }

    const resetTable = (e) => {
        e.preventDefault()
        setUsers(initialUsers)
        setUsersToDelete([]);
        setUserIncrement(initialUserIncrement);
        setAdminIncrement(initialAdminIncrement);
    }
    
    const saveTable = (e) => {
        e.preventDefault();

        const sendRemoveRequest = async () => {
            await axios.post("/api/admin/remove_user", {data: usersToDelete})
            .catch(err => console.error(err))
        }

        const sendPostRequest = async () => {
            await axios.post("/api/admin/save_user", {data: users})
            .catch(err => console.error(err));
        };

        if (usersToDelete.length > 0){
            sendRemoveRequest();
            //Reset list after deleting all items
            setUsersToDelete([]);
        }

        //Backend: Send current users table to flask backend for saving
        sendPostRequest();

        //Setting initial state to current user table
        setInitialUsers(users);
        setInitialUserIncrement(userIncrement);
        setInitialAdminIncrement(adminIncrement);
    }

    //Send the user count to dashboard everytime save button is pressed
    useEffect(() => {
        getUsers(initialUsers)
    }, [initialUsers, getUsers])

    return (
        
        <div className='user-container'>
            
            <div className="table-options">

                <Input
                    label={""}
                    type={"text"}
                    name={"search"}
                    placeholder={"Search Users..."}
                    required={false}
                    defaultValue={search}
                    handleInput={(e) => handleSearch(e)}
                />

                <div className="modification-options">
                    <button className="blue-button" onClick={addAdmin}>Add Admin</button>
                    <button className="green-button" onClick={saveTable}>Save Changes</button>
                    <button className="red-button" onClick={resetTable}>Cancel Changes</button>
                </div>

            </div>

            <form className='table-container'>
                <UserTable 
                    users={filteredUsers.slice(rowOffset, rowOffset + rowsPerPage)} 
                    onEditTable={onEditTable}
                    onDisableUser={onDisableUser}
                    onDeleteUser={onDeleteUser}
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
export default UserList