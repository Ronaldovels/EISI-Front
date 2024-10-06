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

  const lastQueriedValue = useRef(''); 

  // Mapeamento de rótulos amigáveis
  const characteristicLabels = {
    name: "Name",
    gender: "Gender",
    filiation: "Filiation",
    race: "Race",
    hair_color: "Hair color",
    eye_color: "Eye color",
    introducion_arc: "Introduction Arc",
    family: "Family",
    techniques: "Techniques"
  };

  // Função para buscar o personagem aleatório (do dia) ao carregar o componente
  useEffect(() => {
    const fetchDailyCharacter = async () => {
      try {
        const response = await fetch('https://eisi-back.onrender.com/character/daily');
        const data = await response.json();
        setDailyCharacter(data); 
      } catch (error) {
        console.error('Erro ao buscar o personagem do dia:', error);
      }
    };

    fetchDailyCharacter();
  }, []);

  // Função para buscar os dados da API com base no nome digitado
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
        const filteredNames = data.map(item => item.name).filter(Boolean);
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

  // Função para buscar o personagem completo baseado no nome
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

  // Função chamada quando o usuário digita no input
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setIsSuggestionSelected(false);

    fetchSuggestions(value);
  };

  // Função para quando o usuário seleciona uma sugestão
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setSuggestions([]);
    setIsSuggestionSelected(true);
    fetchCharacterDetails(suggestion); 
  };

  // Lidar com o envio do formulário e comparar o personagem selecionado com o personagem do dia
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSuggestionSelected && selectedCharacter && dailyCharacter) {
      setComparisonHistory((prevHistory) => [
        { selectedCharacter, dailyCharacter },
        ...prevHistory
      ]);
      setInputValue(''); // Limpa o campo de entrada após envio
      setIsSuggestionSelected(false);
  
      // Força a perda de foco
      document.activeElement.blur();
    } else {
      alert('Por favor, selecione uma das sugestões.');
    }
  };
  

  // Função para renderizar a comparação de características
  const renderComparison = (comparison, index) => {
    const { selectedCharacter, dailyCharacter } = comparison;

    const characteristics = ['name', 'gender', 'filiation', 'race', 'hair_color', 'eye_color', 'introducion_arc', 'family', 'techniques'];

    return (
      <div key={index} className="comparison-container">
        {/* Cabeçalhos com os nomes das características */}
        <div className="comparison-labels">
          {characteristics.map((characteristic) => (
            <div key={characteristic} className="label-item">
              <strong>{characteristicLabels[characteristic]}</strong>
            </div>
          ))}
        </div>

        {/* Valores de comparação */}
        <div className="comparison-values">
          {characteristics.map((characteristic, i) => {
            const userValue = selectedCharacter[characteristic];
            const dailyValue = dailyCharacter[characteristic];
            const isMatch = userValue && userValue.toLowerCase() === dailyValue.toLowerCase();

            return (
              <div
                key={characteristic}
                className={`comparison-item ${isMatch ? 'match' : 'mismatch'}`}
              >
                {userValue}
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
          />
          <button type="submit" id="submitButton" disabled={!isSuggestionSelected}>
          <img src="https://cdn.discordapp.com/attachments/691418911580749835/1292448273231122494/submitButton.png?ex=6703c5c0&is=67027440&hm=29dfbf651445c89d27ddeedf211b2d62a17c910791fb41457654cd1b46c9250d&" alt="submit" id='submitButtonImg'/>
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

      {/* Exibe a comparação dos personagens em uma div separada */}
      <div className="comparison-results">
        {comparisonHistory.map((comparison, index) => renderComparison(comparison, index))}
      </div>
    </div>
  );
}

export default GuessForm;
