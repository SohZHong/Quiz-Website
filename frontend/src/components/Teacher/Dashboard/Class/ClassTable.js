// Customers.js
import React from 'react'
import Class from './Class'

function ClassTable({classes, onVisitClass, onDeleteClass}) {

  return (
        <table>
            <thead>
                <tr>
                    <th>Class</th>
                    <th>Created</th>
                    <th>Code</th>
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
            onDeleteClass={onDeleteClass}
            />) 
            }
          </tbody>
        </table>
  )
}

export default ClassTable