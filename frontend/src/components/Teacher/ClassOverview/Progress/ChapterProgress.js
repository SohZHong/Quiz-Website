import React from "react";
import ProgressBar from '../../../addon/ProgressBar'

function ChapterProgress ({ chapter: {id, title, completed, total}, members, completedChapters }) {

    const completePercentage = Number((completed / total) * 100).toFixed(0); //Remove decimal places and parse to String
    const displayPercentage = isNaN(completePercentage) ? 0 : completePercentage; //Prevent Nan when class has no members
    return (
        <React.Fragment>
            <div key={id} className="progress-container">
            <div className="progress-details">
                <div>
                    <h4>{completed} Students Completed</h4>
                    <h2>{title}</h2>
                </div>
                <div>
                    <h1>{displayPercentage}%</h1>
                </div>
            </div>
                <ProgressBar completion={completePercentage} />
            </div>
            <div className="completion-list">
                <ul className="member-status">
                    {members.map(member => {
                        const exist = completedChapters.filter(cMember => cMember.chapter_id === id).some(cMember => cMember.id === member.id);
                        
                        const status = exist ? "completed" : "unfinished";
                        const statusText = exist ? "Done" : "Unfinished";

                        return (
                            <li key={member.id}>
                                <span>{member.name}</span>
                                <div className={"completion-status " + status}>
                                    {statusText}
                                </div>
                            </li>

                        )
                    })}
                </ul>
            </div>
        </React.Fragment>
    );
};

export default ChapterProgress;