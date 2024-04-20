import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaPlay, FaPause, FaRedo, FaForward } from 'react-icons/fa';
import DarkModeToggleComponent from '../components/Darkmode.jsx'; 

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

const CircleBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  background-color: #e0e0e0;
  border: 8px solid #A020F0;
  box-sizing: border-box;
`;

const CircleProgress = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 8px solid #A020F0;
  border-top: 8px solid transparent;
  animation: ${progressAnimation} 1s linear infinite;
  animation-play-state: ${({ isRunning }) => (isRunning ? 'running' : 'paused')};
  transform: ${({ progress }) => `rotate(${progress}deg)`};
  box-sizing: border-box;
`;

const Timer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem; 
  text-transform: uppercase; 
  color: ${({ isFocusTimer }) => (isFocusTimer ? '#000000' : '#000000')};
`;

const AdditionalText = styled.span`
  font-size: 1.3rem;
  margin-top: 10px; 
  text-align: center; 
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 120px;
  margin-top: 15px;
`;

const PomodoroTimer = () => {
  const [time, setTime] = useState(1500); 
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFocusTimer, setIsFocusTimer] = useState(true); 

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => {
          if (prevTime === 0) {
            clearInterval(interval);
            setIsRunning(false);
            if (isFocusTimer) {
              setTime(300);
              document.title = "Break Timer";
            } else {
              setTime(1500);
              document.title = "Focus Timer"; 
            }
            setIsFocusTimer(prevIsFocusTimer => !prevIsFocusTimer);
            return prevTime;
          } else {
            document.title = `${Math.floor(prevTime / 60).toString().padStart(2, '0')}:${(prevTime % 60).toString().padStart(2, '0')} - ${isFocusTimer ? 'Focus' : 'Break'}`;
            return prevTime - 1;
          }
        });
        setProgress(prevProgress => (prevProgress === 360 ? 0 : prevProgress + (360 / time)));
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
    setTime(1500);
    setProgress(0);
  };

  const skipTimer = () => {
    setIsRunning(false); 
 
    if (isFocusTimer) {
      setTime(300); 
    } else {
      setTime(1500); 
    }
    setIsFocusTimer(prevIsFocusTimer => !prevIsFocusTimer); 
  };

  const formatTime = () => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    const timerType = isFocusTimer ? 'Focus' : 'Break';
    return { time: `${minutes}:${seconds}`, additionalText: `${timerType}` };
  };

  return (
    <PomodoroContainer>
      <DarkModeToggleComponent /> 
      <CircleContainer>
        <CircleBackground />
        <CircleProgress isRunning={isRunning} progress={progress} />
        <Timer isFocusTimer={isFocusTimer}>
          {formatTime().time}
          <AdditionalText>{formatTime().additionalText}</AdditionalText>
        </Timer>
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
  );
};

export default PomodoroTimer;
