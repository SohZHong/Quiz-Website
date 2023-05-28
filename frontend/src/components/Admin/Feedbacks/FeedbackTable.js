import React from 'react'
import Feedback from './Feedback'

function FeedbackTable({feedbacks, onClickFeedback, onDeleteFeedback}) {

  return (
      <div className='feedback-container'>
          <div className='feedback-headers'>
            <span>Feedback Title</span>
            <span>Posted Date</span>
            <span>Status</span>
          </div>

        <div className='feedback-table'>
          { feedbacks.map((feedback, index) => 
          <Feedback
              key={index} 
              feedback={feedback} 
              onClickFeedback={onClickFeedback}
              onDeleteFeedback={onDeleteFeedback}
          />) 
          }
        </div>
      </div>
  )
}

export default FeedbackTable