import React from "react"


function Chapter ({ chapter: {id, title, description, progression}, onChapterClick}){

    return (
        <div className ="chapter_box" onClick={() => onChapterClick(id, progression)}>
            <span className="chapter_title">{title}</span>
            <div className='progress_bar'>
                <div className="circular_bar" style={{ background: `conic-gradient(green 
                    ${progression ? '360deg' : '0deg'}, #142A4E 0deg)` }}>
                    <div className ="innerCircle">
                        <span className="progress_value">{progression ? <span className="tick">&#10003;</span> : ""}</span>
                    </div>
                </div>
            </div>
            <span className="chapter_description">{description}</span>
        </div> 
    )
}

export default Chapter