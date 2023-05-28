import React from 'react';
import Modal from './Modal';

function ResultsModal({isOpen, onClose, score, buttonMsg="Return to Home Screen"}) {

    return( 
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="results-modal-container">
                <div className="result-modal-wrapper">
                    <h2 className="result-status">{score < 50 ? "Keep Up the Good Work Next Time!" : "Excellent Job!"} </h2>
                    <h3 className='total-score'>Total Score:</h3>
                    <h1 className="score-percentage" style={score < 50 ? {color: '#D65151'} : {color: '#9fe756'}}>{score}%</h1>
                    <button className="return-button" onClick={onClose}>{buttonMsg}</button>
                </div>
            </div>
        </Modal>
    )
}

export default ResultsModal