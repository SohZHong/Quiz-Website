import React from "react";

function ExamProgress ({ members, completedExams }) {

    return (
        <div className="completion-list">
            <ul className="member-status">
                {members.map((member) => {
                    const completedMember = completedExams.find(
                        (cMember) => cMember.id === member.id
                    );

                    const exist = completedMember !== undefined;
                    const score = exist ? completedMember.score : "TBD";
                    const status = score > 40 ? "pass" : score === "TBD" ? "pending" : "fail";
        
                    return (
                        <li key={member.id}>
                            <span>{member.name}</span>
                            <div className={'completion-status ' + status}>
                                {score}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ExamProgress;