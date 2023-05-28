import React from "react";
import Chapter from "./Chapter";
import { useNavigate } from "react-router-dom";

function ChapterList({ studentID, classID, chapters }){

    const navigate = useNavigate();

    const onChapterClick = (id, progression) => {
        //Future add navigate
        navigate(`/student/${studentID}/class/${classID}/chapter/${id}`, {state: {progression}})
    }

    return (
        <div className='chapter_container'>
            {chapters.map((chapter, index) =>
                <Chapter 
                    key={index} 
                    chapter={chapter}
                    onChapterClick = {onChapterClick}
                />
            )}
        </div>
    )
}

export default ChapterList