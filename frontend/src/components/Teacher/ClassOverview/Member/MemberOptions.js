import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Dropdown from 'react-bootstrap/Dropdown'

function MemberOptions(){
    return (
        <Dropdown align="start">
            <Dropdown.Toggle className='dark-button'>
                <FontAwesomeIcon icon="fa-solid fa-ellipsis" />
            </Dropdown.Toggle>
            <Dropdown.Menu className='dropdown-link'>
                <Dropdown.Item className='danger-option'><FontAwesomeIcon icon="fa-solid fa-trash" />Remove Member</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default MemberOptions