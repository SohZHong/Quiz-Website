import React from 'react';
import './frontpage.scss';
import image1 from '../../images/ProgressTracking.png';
import image2 from '../../images/LeaderboardSystem.png';
import image3 from '../../images/QuizMaking.png';
import { useNavigate } from 'react-router-dom';

function HomePage() {
 
  const navigate = useNavigate();

  const handleLoginClick = (e) => {
    e.preventDefault();
    navigate("/login");
  }

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate("/register");
  }

  const handleAboutUsClick = (e) => {
    e.preventDefault();
    navigate("/about");
  }

  return (
    <div className="homepage">

      <section className="frontpg_section">
        <img className="logo" alt='Company_Logo'></img>
        <span className="frontpgtxt_big">Bringing Quizzes to A Whole New Level</span>
        <span className="frontpgtxt_small">Teachers can create interactive quizzes to help students 
learn more effectively.</span>
        <button className="frontpage-sct1-btn btn1" onClick={handleRegisterClick}>Sign Up for free</button>
        <button className="frontpage-sct1-btn btn2" onClick={handleLoginClick}>Already have an account?</button>
      </section>

      <section className="frontpg_section">
        <span className="frontpgtxt_big">Why Quizzeria?</span>
        <span className="frontpgtxt_small"> Engaging and interactive quizzes with multimedia elements</span>
        <span className="frontpgtxt_small"> Customisable quizzes that appeal to
  students' specific needs and interests</span>
        <button onClick={handleAboutUsClick} className="frontpage-sct1-btn btn3">About Us</button>
      </section>

      <section className="frontpg_section">

        <span className="frontpgtxt_big">Features</span>
        <div className="frontpg_grid">

          <div className="frontpg_component">
            <img className="frontpg_picture" alt="Progress_Tracking" src={image1}></img>
            <br/><br/>
            <span className="component_txt">Progress tracking</span>
          </div>

          <div className="frontpg_component">
            <img className="frontpg_picture" alt="Ranking" src={image2}></img>
            <br/><br/>
            <span className="component_txt">Ranking system</span>
          </div>
          
          <div className="frontpg_component">
            <img className="frontpg_picture" alt='Quiz' src={image3}></img>
            <br/><br/>
            <span className="component_txt">Quiz making</span>
          </div>
          
        </div>
      </section>

      <section className="frontpg_section">
        <button className="frontpage-sct1-btn btn1" onClick={handleRegisterClick}>Sign Up Now!</button>
      </section>   

    </div>

  )
}

export default HomePage;