import React, { useState } from 'react';
import './ContactUs.scss';
import Modal from '../addon/Modal';
import TextArea from '../addon/TextArea';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ContactUs () {

   const [feedback, setFeedback] = useState({
      name: '',
      title: '',
      email: '',
      enquiries: '',
   });
   const [isOpen, setIsOpen] = useState(false);
   const navigate = useNavigate();

   const handleSubmit = (e) => {
      e.preventDefault();

      const sendPostRequest = async() => {
         await axios.post("/api/send_feedback", {data: feedback})
         .catch(err => console.error(err))
      }
      handleOpenModal();
      sendPostRequest();

   }

   const handleOpenModal = () => {
      setIsOpen(true);
  }

   const handleCloseModal = (e) => {
      e.preventDefault();
      setIsOpen(false);
      navigate(-1);
   }

   const handleChange = (e) => {

      const { name, value } = e.target;

      const updatedData = {...feedback, [name]: value};
      setFeedback(updatedData);
   }
   const headerStyle = {margin: '10px', padding: '10px', textAlign: 'center', color: '#E3E3E3'};
   const buttonStyle = {border: '1px solid ', margin: '20px', padding: '10px', fontSize: '1.3em'};

   return(
      <section className='Container'>
         <div className='contact-wrapper'>
            <div className="contact-container">
               <span className="contact_title">Any enquires? Do let us know!</span>
               <form className="small_container" onSubmit={handleSubmit}>
                  <img alt='support_pic' src={require('../../images/Contact_us.png')} className="contact_pic"></img>
                  <div className="contact_input">
                     <input type="text" name="name" value={feedback.name} onChange={handleChange} placeholder="Name" />
                     <input type="email" name="email" value={feedback.email} onChange={handleChange} placeholder="Email Address" />
                     <input type="text" name="title" value={feedback.title} onChange={handleChange} placeholder="Enquires Title" />
                     <TextArea 
                        maxLength={300}
                        name={"enquiries"}
                        placeholder={"Enquiries"}
                        required={true}
                        onTextAreaChange={handleChange}
                        value={feedback.enquiries}
                        index={1}
                        rows={5}
                     />
                     <input type="submit" name="contact_submit" />
                  </div>
               </form>
            </div>
            <Modal isOpen={isOpen} onClose={handleCloseModal}>
               <h1 style={headerStyle}>Your Feedback has been received!</h1>
               <button 
                  style={buttonStyle} 
                  onClick={handleCloseModal}>
                     Return
               </button>
            </Modal>
         </div>
      </section>
   )
}

export default ContactUs