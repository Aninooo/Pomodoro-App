// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import styled, { keyframes, ThemeProvider } from 'styled-components';
import { FaPlay, FaPause, FaRedo, FaForward, FaUpload } from 'react-icons/fa';
import DarkModeToggleComponent from '../components/Darkmode/Darkmode.jsx';

const darkTheme = {
};

const lightTheme = {

};

const progressAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const PomodoroContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const CircleContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
`;

const Square = styled.div`
  position: absolute;
  width: 170px;
  height: 170px;
  background-image: url(${({ backgroundImage }) => backgroundImage});
  background-size: cover;
  background-position: center;
  box-sizing: border-box;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.50);
`;

const BottomSquare = styled(Square)`
  bottom: -220px;
  left: 50%;
  transform: translateX(-50%);
`;

const CircleBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  border: 3px solid #A020F0;
  box-sizing: border-box;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.40);
  cursor: pointer;
`;

const CircleProgress = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid #A020F0;
  border-top: 3px solid transparent;
  animation: ${progressAnimation} 1s linear infinite;
  animation-play-state: ${({ isRunning }) => (isRunning ? 'running' : 'paused')};
  transform: ${({ progress }) => `rotate(${progress}deg)`};
  box-sizing: border-box;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.15);
`;

const Timer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%) translateY(${({ isFocusTimer }) => (isFocusTimer ? '-5px' : '5px')});
  font-size: 3rem;
  text-transform: uppercase;
  color: ${({ isFocusTimer, theme }) => (isFocusTimer ? theme.textColor : theme.textColor)};
  font-family: 'Hanalei Fill', cursive;
  transition: transform 0.3s ease;
`;

const AdditionalText = styled.span`
  font-size: 1.3rem;
  margin-top: 10px;
  text-align: center;
  font-weight: bold;
  color: ${({ theme }) => theme.textColor}; 
  transition: transform 0.3s ease;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 120px;
  margin-top: 15px;
`;

const FileInputContainer = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const FileInputText = styled.span`
  margin-left: 5px;
`;

const UploadIcon = styled(FaUpload)`
  font-size: 24px;
  cursor: pointer;
`;

const PomodoroTimer = () => {
  const [time, setTime] = useState(3600);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFocusTimer, setIsFocusTimer] = useState(true);
  const [backgroundImages, setBackgroundImages] = useState({
    left: null,
    right: null,
    top: null,
    bottom: null,
  });
  const [uploadedImages, setUploadedImages] = useState({
    left: false,
    right: false,
    top: false,
    bottom: false,
  });

  useEffect(() => {
    const storedBackgroundImages = JSON.parse(localStorage.getItem('backgroundImages'));
    if (storedBackgroundImages) {
      setBackgroundImages(storedBackgroundImages);
    }
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => {
          if (prevTime === 0) {
            clearInterval(interval);
            setIsRunning(false);
            if (isFocusTimer) {
              setTime(300);
              document.title = 'Break Timer';
            } else {
              setTime(3600);
              document.title = 'Focus Timer';
            }
            setIsFocusTimer(prevIsFocusTimer => !prevIsFocusTimer);
            return prevTime;
          } else {
            document.title = `${Math.floor(prevTime / 60)
              .toString()
              .padStart(2, '0')}:${(prevTime % 60).toString().padStart(2, '0')} - ${
              isFocusTimer ? 'Focus' : 'Break'
            }`;
            return prevTime - 1;
          }
        });
        setProgress(prevProgress => (prevProgress === 360 ? 0 : prevProgress + 360 / time));
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, isFocusTimer, time]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(3600);
    setProgress(0);
  };

  const skipTimer = () => {
    setIsRunning(false);

    if (isFocusTimer) {
      setTime(300);
    } else {
      setTime(3600);
    }
    setIsFocusTimer(prevIsFocusTimer => !prevIsFocusTimer);
  };

  const handleImageUpload = (event, position) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result;
      setBackgroundImages(prevBackgroundImages => ({
        ...prevBackgroundImages,
        [position]: imageUrl,
      }));

      localStorage.setItem('backgroundImages', JSON.stringify({
        ...prevBackgroundImages,
        [position]: imageUrl,
      }));
    };
    reader.readAsDataURL(file);
    setUploadedImages(prevUploadedImages => ({
      ...prevUploadedImages,
      [position]: true,
    }));
  };

  const formatTime = () => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    const timerType = isFocusTimer ? 'Focus' : 'Break';
    return { time: `${minutes}:${seconds}`, additionalText: `${timerType}` };
  };

  const isDarkMode = false;

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <PomodoroContainer>
        <DarkModeToggleComponent />
        <CircleContainer>
          <CircleBackground />
          <CircleProgress isRunning={isRunning} progress={progress} />
          <Timer isFocusTimer={isFocusTimer}>
            {formatTime().time}
            <AdditionalText>{formatTime().additionalText}</AdditionalText>
          </Timer>
          <BottomSquare backgroundImage={backgroundImages.bottom}>
            {!uploadedImages.bottom && (
              <FileInputContainer>
                <UploadIcon />
                <FileInputText>Your inspiration</FileInputText>
                <input type="file" onChange={e => handleImageUpload(e, 'bottom')} accept="image/*" style={{ display: 'none' }} />
              </FileInputContainer>
            )}
          </BottomSquare>
        </CircleContainer>
        <ButtonContainer>
          <FaRedo onClick={resetTimer} style={{ fontSize: '24px', cursor: 'pointer' }} />
          {!isRunning ? (
            <FaPlay onClick={startTimer} style={{ fontSize: '24px', cursor: 'pointer' }} />
          ) : (
            <FaPause onClick={pauseTimer} style={{ fontSize: '24px', cursor: 'pointer' }} />
          )}
          <FaForward onClick={skipTimer} style={{ fontSize: '24px', cursor: 'pointer' }} />
        </ButtonContainer>
      </PomodoroContainer>
    </ThemeProvider>
  );
};

export default PomodoroTimer;
