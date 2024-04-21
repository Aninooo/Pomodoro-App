import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { FaSun, FaMoon } from 'react-icons/fa';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ darkMode }) => (darkMode ? '#333' : '#fff')};
    color: ${({ darkMode }) => (darkMode ? '#fff' : '#000')};
  }
`;

const DarkModeContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
`;

const DarkModeToggle = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 18px;
  color: ${({ darkMode }) => (darkMode ? 'white' : 'black')};
`;

const ModeText = styled.span`
  margin-left: 5px;
`;

const DarkModeToggleComponent = () => {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(prevDarkMode => !prevDarkMode);
  };

  return (
    <div>
      <GlobalStyle darkMode={darkMode} />
      <DarkModeContainer>
        <DarkModeToggle darkMode={darkMode} onClick={toggleDarkMode}>
          {darkMode ? <FaMoon size={24} /> : <FaSun size={24} />} 
          <ModeText>{darkMode ? 'Light Mode' : 'Dark Mode'}</ModeText>
        </DarkModeToggle>
      </DarkModeContainer>
    </div>
  );
};

export default DarkModeToggleComponent;
