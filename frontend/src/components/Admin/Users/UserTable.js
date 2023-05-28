// Customers.js
import React from 'react'
import User from './User'

function UserTable({users, onEditTable, onDisableUser, onDeleteUser}) {

  return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Password</th>
                    <th>Email</th>
                    <th>Account Type</th>
                    <th>Registered Date</th>
                    <th>Action</th>
                </tr>
            </thead>

          <tbody>
            { users.map((user, index) => 
            <User 
              key={index} 
              user={user} 
              onEditTable={onEditTable}
              onDisableUser={onDisableUser}
              onDeleteUser={onDeleteUser}
            />) 
            }
          </tbody>
        </table>
  )
}

export default UserTable