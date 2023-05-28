import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Dropdown from 'react-bootstrap/Dropdown'

function ChapterOptions(){
    return (
        <Dropdown align="start">
            <Dropdown.Toggle className='dark-button'>
                <FontAwesomeIcon icon="fa-solid fa-ellipsis" />
            </Dropdown.Toggle>
            <Dropdown.Menu className='dropdown-link'>
                <Dropdown.Item><FontAwesomeIcon icon="fa-solid fa-pen" />Edit Chapter</Dropdown.Item>   

                <Dropdown.Divider />

                <Dropdown.Item className='danger-option'><FontAwesomeIcon icon="fa-solid fa-trash" />Remove Chapter</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default ChapterOptions