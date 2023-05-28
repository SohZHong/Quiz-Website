import React from 'react';
import './frontpage.scss'
import '../../variables.scss';
import { useNavigate } from 'react-router-dom';


function AboutUs() {

    const navigate = useNavigate();

    const handleRegisterClick = (e) => {
        e.preventDefault();
        navigate("/register");
    }

    return (
        <div className="homepage">
            <div className="aboutus-section">
                <span className="frontpgtxt_big" >Making quizzes more 
            interesting than ever before</span>
            <br/><br/><br/><br/>
                <img alt="firstpic" id="aboutus_refpic1" />
                <br/><br/><br/><br/>
                <img alt="secondpic" id="aboutus_refpic2" />
                <span className="frontpgtxt_small aboutus_text" >Embark your journey as a learner at here!</span>
                <br/><br/><br/><br/><br/><br/>
                <div className="btn-signup">
                    <button className="frontpage-sct1-btn btn1" onClick={handleRegisterClick}>Sign Up for free</button>
                </div>
            </div>
            <div className="aboutus-section">
                <span className="frontpgtxt_big">Our Team</span>
                <div id="Quizzeria_team">
                    <div className="circle_object">
                        <img alt="human1" id="aboutus_human1" />
                        <span className="team_font" >Soh Zhe Hong</span>
                    </div>
                    <div className="circle_object">
                        <img alt="human2" id="aboutus_human2" />
                        <span className="team_font" >Sia Jun Ian</span>
                    </div>
                    <div className="circle_object">
                        <img alt="human3" id="aboutus_human3" />
                        <span className="team_font" >Wong Jun Shen</span>
                    </div>
                    <div className="circle_object">
                        <img alt="human4" id="aboutus_human4" />
                        <span className="team_font" >Sean Hoe Kai Zher</span>
                    </div>    
                </div>
            </div>
            <div className="aboutus-section">
                <span className="frontpgtxt_big" >The Quizzeria Office</span>

                <br/><br/><br/><br/><br/><br/><br/>
                <iframe
                    title='Office_Location'
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15936.580811779979!2d101.68800002676183!3d3.0557894643947483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc4abb795025d9%3A0x1c37182a714ba968!2sAsia%20Pacific%20University%20of%20Technology%20%26%20Innovation%20(APU)!5e0!3m2!1sen!2smy!4v1680425593454!5m2!1sen!2smy"
                    width="600"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />      
                <br/><br/><br/><br/><br/><br/><br/>          
                <span className="frontpgtxt_small" >Jalan Teknologi 5, Taman Teknologi Malaysia, 57000 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur</span>

            </div>

        </div>
            
            
        
    )
}

export default AboutUs
    