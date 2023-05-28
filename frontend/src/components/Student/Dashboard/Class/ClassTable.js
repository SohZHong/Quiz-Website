// Customers.js
import React from 'react'
import Class from './Class'

function ClassTable({classes, onVisitClass, onLeaveClass}) {

  return (
        <table>
            <thead>
                <tr>
                    <th>Class</th>
                    <th>Joined</th>
                    <th>Completion</th>
                    <th>Action</th>
                </tr>
            </thead>

            <colgroup>
              <col span="1" style={{width: "50%"}} />
              <col span="2" style={{width: "15%"}} />
            </colgroup>

          <tbody>
            { classes.map(group => 
            <Class 
            key={group.id} 
            class={group} 
            onVisitClass={onVisitClass}
            onLeaveClass={onLeaveClass}
            />) 
            }
          </tbody>
        </table>
  )
}

export default ClassTable