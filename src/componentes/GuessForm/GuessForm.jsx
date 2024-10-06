import React, { useState, useEffect, useRef } from 'react';
import './GuessForm.css';

function GuessForm() {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionSelected, setIsSuggestionSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dailyCharacter, setDailyCharacter] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [comparisonHistory, setComparisonHistory] = useState([]);
  const [isGuessedCorrectly, setIsGuessedCorrectly] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(''); // Para o tempo restante

  const lastQueriedValue = useRef('');

  // Referência para a div onde o personagem correto será mostrado
  const guessedCharacterRef = useRef(null);

  const characteristicLabels = {
    name: 'Name',
    gender: 'Gender',
    filiation: 'Filiation',
    race: 'Race',
    hair_color: 'Hair color',
    eye_color: 'Eye color',
    introducion_arc: 'Introduction Arc',
    family: 'Family',
    techniques: 'Techniques',
    characterImg: 'Character'
  };

  useEffect(() => {
    const fetchDailyCharacter = async () => {
      try {
        const response = await fetch('https://eisi-back.onrender.com/character/daily');
        const data = await response.json();
        setDailyCharacter(data);

        // Verificar se o usuário já acertou o personagem do dia e restaurar histórico
        const savedDailyGuess = localStorage.getItem('dailyGuess');
        const savedComparisonHistory = localStorage.getItem('comparisonHistory');
        
        if (savedDailyGuess) {
          const parsedGuess = JSON.parse(savedDailyGuess);
          if (parsedGuess && parsedGuess.characterId === data.id) {
            setIsGuessedCorrectly(true); // O usuário já acertou hoje
          }
        }

        // Restaurar o histórico de comparações
        if (savedComparisonHistory) {
          const parsedHistory = JSON.parse(savedComparisonHistory);
          setComparisonHistory(parsedHistory);
        }
      } catch (error) {
        console.error('Erro ao buscar o personagem do dia:', error);
      }
    };

    fetchDailyCharacter();
  }, []);

  const fetchSuggestions = async (query) => {
    if (query.length === 0) {
      setSuggestions([]);
      return;
    }

    if (query === lastQueriedValue.current) {
      return;
    }

    setLoading(true);
    lastQueriedValue.current = query;

    try {
      const response = await fetch(`https://eisi-back.onrender.com/character?name=${query}`);
      const data = await response.json();

      if (data && Array.isArray(data)) {
        const filteredNames = data.map((item) => item.name).filter(Boolean);
        setSuggestions(filteredNames.slice(0, 5));
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
      setSuggestions([]);
    }

    setLoading(false);
  };

  const fetchCharacterDetails = async (name) => {
    try {
      const response = await fetch(`https://eisi-back.onrender.com/character?name=${name}`);
      const data = await response.json();
      if (data && data.length > 0) {
        setSelectedCharacter(data[0]);
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes do personagem:', error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setIsSuggestionSelected(false);

    fetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setSuggestions([]);
    setIsSuggestionSelected(true);
    fetchCharacterDetails(suggestion);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSuggestionSelected && selectedCharacter && dailyCharacter) {
      const characteristics = [
        'name', 'gender', 'filiation', 'race', 'hair_color', 'eye_color', 'introducion_arc', 'family', 'techniques'
      ];

      const allMatched = characteristics.every((characteristic) => {
        const userValue = selectedCharacter[characteristic];
        const dailyValue = dailyCharacter[characteristic];
        return userValue && userValue.toLowerCase() === dailyValue.toLowerCase();
      });

      const newComparison = {
        selectedCharacter,
        dailyCharacter,
        id: new Date().getTime() // Criação de um ID único baseado no timestamp
      };

      setComparisonHistory((prevHistory) => {
        const updatedHistory = [newComparison, ...prevHistory]; // Novo item adicionado no início

        // Salvar o histórico atualizado no Local Storage
        localStorage.setItem('comparisonHistory', JSON.stringify(updatedHistory));

        return updatedHistory;
      });

      if (allMatched) {
        setIsGuessedCorrectly(true);

        // Salvar no localStorage que o usuário já acertou o personagem do dia
        localStorage.setItem(
          'dailyGuess',
          JSON.stringify({ characterId: dailyCharacter.id, guessed: true })
        );
      }

      setInputValue('');
      setIsSuggestionSelected(false);

      document.activeElement.blur();
    } else {
      alert('Por favor, selecione uma das sugestões.');
    }
  };

  // Função para calcular o tempo restante até o próximo personagem (24h UTC)
  const calculateTimeRemaining = () => {
    const now = new Date();
    const nextCharacterTime = new Date();
    nextCharacterTime.setUTCHours(24, 0, 0, 0); // Define para meia-noite UTC do próximo dia
    if (now.getUTCHours() >= 0) {
      nextCharacterTime.setUTCDate(now.getUTCDate() + 1);
    }

    const timeDiff = nextCharacterTime - now; // Diferença em milissegundos

    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
    const seconds = Math.floor((timeDiff / 1000) % 60);

    setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
  };

  useEffect(() => {
    if (isGuessedCorrectly && guessedCharacterRef.current) {
      guessedCharacterRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isGuessedCorrectly]);

  // Chamar a função para atualizar o tempo restante
  useEffect(() => {
    const timer = setInterval(calculateTimeRemaining, 1000); // Atualiza o tempo a cada segundo
    return () => clearInterval(timer); // Limpa o intervalo ao desmontar o componente
  }, []);

  const renderComparison = (comparison, index) => {
    const { selectedCharacter, dailyCharacter } = comparison;
  
    const characteristics = [
      'characterImg', 'name', 'gender', 'filiation', 'race', 'hair_color', 'eye_color', 'introducion_arc', 'family', 'techniques'
    ];
  
    return (
      <div key={comparison.id} className={`comparison-container animate-item`}>
        <div className="comparison-labels">
          {characteristics.map((characteristic) => (
            <div key={characteristic} className="label-item">
              <strong>{characteristicLabels[characteristic]}</strong>
            </div>
          ))}
        </div>
  
        <div className="comparison-values">
          {characteristics.map((characteristic) => {
            const userValue = selectedCharacter[characteristic];
            const dailyValue = dailyCharacter[characteristic];
            const isMatch = userValue && dailyValue && userValue.toLowerCase() === dailyValue.toLowerCase();
  
            // Verifica se a característica é a imagem
            if (characteristic === 'characterImg') {
              return (
                <div
                  key={characteristic}
                  className={`comparison-item ${isMatch ? 'match' : 'mismatch'}`}
                >
                  {/* Renderiza a imagem do personagem escolhido pelo usuário */}
                  {selectedCharacter && selectedCharacter.characterImg && (
                    <img
                      src={selectedCharacter.characterImg}
                      alt={selectedCharacter.name || 'Selected character'}
                      className="comparison-img"
                      onError={(e) => { e.target.src = '/path/to/fallback-image.jpg'; }} // Fallback para imagem padrão
                    />
                  )}
                </div>
              );
            }
  
            return (
              <div
                key={characteristic}
                className={`comparison-item ${isMatch ? 'match' : 'mismatch'}`}
              >
                {userValue || 'N/A'}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <div id="formTitleContainer">
        <h1 id="formt_title">Guess The Character</h1>
      </div>
      <div id="formContainer">
        <form onSubmit={handleSubmit} id="form_">
          <input
            id="character"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            required
            placeholder="Digite um personagem"
            autoComplete="off"
            disabled={isGuessedCorrectly} // Desativa o input se o personagem foi adivinhado
          />
          <button
            type="submit"
            id="submitButton"
            disabled={!isSuggestionSelected || isGuessedCorrectly} // Desativa o botão se o personagem foi adivinhado
          >
            <img
              src="https://i.postimg.cc/CKs3ztg0/submit-Button.png"
              alt="submit"
              id="submitButtonImg"
            />
          </button>
        </form>

        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="suggestion-item"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Exibe a mensagem de parabéns acima das comparações */}
      <div className="comparison-results">
        {comparisonHistory.map((comparison, index) => renderComparison(comparison, index))}
      </div>

      <div id="colorIndicatorsContainer">
        <div id='colorIndicators'>
          <h2>Color Indicators</h2>
          <div id="indicatorContainer">
            <div id="correctIndicator">
              <div id='greenSquare'></div>
              <p id='greenText'>Correct</p>
            </div>
            <div id='incorrectIndicator'>
            <div id='redSquare'></div>
            <p id='redText'>Incorrect</p>
          </div>
          </div>
        </div>
      </div>

      {isGuessedCorrectly && dailyCharacter && (
        <div className="success-message" ref={guessedCharacterRef}>
          <h2>Congrats! You guessed today's character!</h2>
          <div id="characterGuessRight">
            <img
              src={dailyCharacter.characterImg} // Usa a URL da imagem retornada pela API
              alt={dailyCharacter.name}
              id="guessedCharacterImg"
            />
            <p id="guessedCharacterName">{dailyCharacter.name}</p>
          </div>
          <p id='tries'>Tries: {comparisonHistory.length}</p> {/* Mostra o número de tentativas */}
          <h2 id='timeNextCharacter'>Next Character in: </h2> {/* Mostra o tempo até o próximo personagem */}
          <p id='timeRemaining'>{timeRemaining}</p>
        </div>
      )}
    </div>
  );
}

export default GuessForm;
