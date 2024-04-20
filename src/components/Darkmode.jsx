import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { FaSun, FaMoon } from 'react-icons/fa';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ darkMode }) => (darkMode ? '#333' : '#fff')};
    color: ${({ darkMode }) => (darkMode ? '#fff' : '#000')}; /* Change text color */
  }
`;

const DarkModeToggle = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: ${({ darkMode }) => (darkMode ? 'white' : 'black')};
`;

const DarkModeToggleComponent = () => {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(prevDarkMode => !prevDarkMode);
  };

  return (
    <div>
      <GlobalStyle darkMode={darkMode} /> 
      <DarkModeToggle darkMode={darkMode} onClick={toggleDarkMode}>
        {darkMode ? <FaMoon /> : <FaSun />}
      </DarkModeToggle>
    </div>
  );
};

export default DarkModeToggleComponent;
