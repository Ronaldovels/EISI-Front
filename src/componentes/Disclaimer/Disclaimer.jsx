import React, { useState, useEffect } from 'react';
import './Disclaimer.css'

function WelcomeMessage() {
    const [isModalVisible, setIsModalVisible] = useState(false);
  
    useEffect(() => {
      // Verifica no localStorage se o usuário já viu a mensagem
      const hasSeenMessage = localStorage.getItem('hasSeenWelcomeMessage');
  
      if (!hasSeenMessage) {
        // Se não viu, exibe a mensagem
        setIsModalVisible(true);
      }
    }, []);
  
    const handleCloseModal = () => {
      // Salva no localStorage para indicar que o usuário já viu a mensagem
      localStorage.setItem('hasSeenWelcomeMessage', 'true');
      setIsModalVisible(false);
    };
  
    return (
      <div>
        {isModalVisible && (
          <div className="modal">
            <div className="modal-content">
              <h2>Welcome to EMINENCDLE!!</h2>
              <p id='disclaimer'>I'm just here to let you know that each one of Cid's disguises (Shadow, Minoru Kageno, Mundane Mann...) is a guessable character.</p>
              <p id='disclaimer'>Enjoy the game!😄</p>
              <button onClick={handleCloseModal} id='disclaimerButton'>Got it</button>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  export default WelcomeMessage;
