import React, { useState, useEffect } from 'react';
import './Leaderboard.scss';
import axios from 'axios';

function Leaderboard({ classID }){
    
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {

        axios.get(`/api/get_leaderboard/${classID}`)
        .then(resp => setLeaderboard(resp.data))
        .catch(err => console.error(err));

    }, [classID])

    //Arrange rankings
    const list = leaderboard.sort((s1, s2)=>{return s2.progression - s1.progression});

    //Top Leaderboard
    const firstToThird = list.filter((user, index) => (index <= 2)) //Filter to return only 1st to 3rd place

    const topLeaderboard = 
        firstToThird.map((user,index) => (
                <div className="leaderboard_top3" key={user.id}>
                    <span>{index +1}</span>
                    <img className='circle' alt={user.name} src={require('../../../../images/user_profiles/' + (user.profile == null ? 'no_pic.png' : user.profile))} />
                    <div className="leaderboard_name">{user.name}</div>
                </div>
            )
        )

    //Split from 4th onwards
    const fourToSixth = list.slice(3,1000);

    const bottomleaderboard = (
        <div className="leaderboard_scroll">
            {fourToSixth.map((user, index) =>( 
            <div className="leaderboard_ranking" key={user.id}>
                <span>{index + 4}</span>
                <div className="circle"></div>
                <div className="leaderboard_name" >{user.name}</div>
            </div>
            )
            )}
        </div>
    );

        return(
            <div className="leaderboard_container">
                <h1 className='leaderboard_title'>Leaderboard</h1>
                <div className="leaderboard_content">
                    <div className='leaderboard_top'>
                        {topLeaderboard}
                    </div>
                    <div className='leaderboard_bottom'>
                        {bottomleaderboard}
                    </div>
                    
                </div>
            </div>
        );
}

export default Leaderboard;