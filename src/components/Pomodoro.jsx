import React, { useState, useEffect } from 'react';
import styled, { keyframes, ThemeProvider } from 'styled-components';
import { FaPlay, FaPause, FaRedo, FaForward, FaUpload, FaCog } from 'react-icons/fa';
import DarkModeToggleComponent from '../components/Darkmode/Darkmode.jsx';
import { getNotificationSounds } from '../notifications/notificationSounds.jsx';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

const darkTheme = {};

const lightTheme = {};

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
  position: relative;
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
  border: 3px solid #a020f0;
  box-sizing: border-box;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.40);
  cursor: pointer;
`;

const CircleProgress = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid #a020f0;
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
  transform: translate(-50%, -50%)
    translateY(${({ isFocusTimer }) => (isFocusTimer ? '-5px' : '5px')});
  font-size: 3rem;
  text-transform: uppercase;
  color: ${({ isFocusTimer, theme }) =>
    isFocusTimer ? theme.textColor : theme.textColor};
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

const SettingsIcon = styled(FaCog)`
  position: absolute;
  bottom: -250px; 
  right: -600px; 
  font-size: 24px;
  cursor: pointer;
`;

const Modal = styled.div`
  display: ${({ open }) => (open ? 'flex' : 'none')}; 
  position: fixed; 
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); 
  background-color: gray;
  border-radius: 50px;
  padding: 150px; 
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  flex-direction: column; 
  justify-content: center; 
  align-items: center; 
`;


const SoundSelect = styled.select`
  margin-top: 0px;
`;

const TimeSelectorContainer = styled.div`
  height: 200px;
  overflow-y: auto;
`;

const SelectedTime = styled.div`
  text-align: center;
  font-weight: bold;
  margin-top: 10px;
`;

const TimeButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
`;

const TimeIndicatorContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;
const TimeOption = styled.div`
  padding: 40px; /* Increase padding for more space */
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const PomodoroTimer = () => {
  const [time, setTime] = useState(3600);
  const [breakTime, setBreakTime] = useState(300); // State for break time
  const [focusTime, setFocusTime] = useState(3600); // State for focus time
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
  const [notificationSounds, setNotificationSounds] = useState([]);
  const [selectedNotificationSound, setSelectedNotificationSound] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [timeSelectionOpen, setTimeSelectionOpen] = useState(false); // Time selection state
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    const storedBackgroundImages = JSON.parse(localStorage.getItem('backgroundImages'));
    if (storedBackgroundImages) {
      setBackgroundImages(storedBackgroundImages);
    }
    
    const sounds = getNotificationSounds();
    setNotificationSounds(sounds);
  }, []);

  useEffect(() => {
    const storedSelectedNotificationSound = localStorage.getItem('selectedNotificationSound');
    if (storedSelectedNotificationSound) {
      setSelectedNotificationSound(storedSelectedNotificationSound);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedNotificationSound', selectedNotificationSound);
  }, [selectedNotificationSound]);

  const playNotificationSound = () => {
    if (selectedNotificationSound) {
      const audio = new Audio(selectedNotificationSound);
      audio.play();
    }
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => {
          if (prevTime === 0) {
            clearInterval(interval);
            setIsRunning(false);
            if (isFocusTimer) {
              setIsFocusTimer(false);
              setTime(breakTime); // Set time to break time when focus mode ends
              document.title = 'Break Timer';
            } else {
              setIsFocusTimer(true);
              setTime(focusTime); // Set time to focus time when break mode ends
              document.title = 'Focus Timer';
            }
            playNotificationSound();
            return prevTime;
          } else {
            document.title = `${Math.floor(prevTime / 60)
              .toString()
              .padStart(2, '0')}:${(prevTime % 60)
              .toString()
              .padStart(2, '0')} - ${isFocusTimer ? 'Focus' : 'Break'}`;
            return prevTime - 1;
          }
        });
        setProgress(prevProgress =>
          prevProgress === 360 ? 0 : prevProgress + 360 / time
        );
      }, 1000);
    } else {
      clearInterval(interval);
    }
  
    return () => clearInterval(interval);
  }, [isRunning, isFocusTimer, time, playNotificationSound, breakTime, focusTime]);
  

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
      setTime(breakTime); // Set time to break time when skipping focus mode
    } else {
      setTime(focusTime); // Set time to focus time when skipping break mode
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

      localStorage.setItem(
        'backgroundImages',
        JSON.stringify({
          ...prevBackgroundImages,
          [position]: imageUrl,
        })
      );
    };
    reader.readAsDataURL(file);
    setUploadedImages(prevUploadedImages => ({
      ...prevUploadedImages,
      [position]: true,
    }));
  };

  const formatTime = () => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    const timerType = isFocusTimer ? 'Focus' : 'Break';
    return { time: `${minutes}:${seconds}`, additionalText: timerType };
  };

  const isDarkMode = false;
  const selectTime = (selectedTime) => {
    setSelectedTime(selectedTime);
    setTime(selectedTime);
  };
  
  const selectTimerType = (isFocus) => {
    setIsFocusTimer(isFocus);
    setTimeSelectionOpen(true);
  };
  
  const setTimeFromSelection = () => {
    setSettingsOpen(false);
    setTimeSelectionOpen(false);
  
    if (isFocusTimer) {
      setFocusTime(selectedTime); // Set focus time when confirmed from selection
    } else {
      setBreakTime(selectedTime); // Set break time when confirmed from selection
    }
  };
  
  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <PomodoroContainer>
        <DarkModeToggleComponent />
        <CircleContainer>
          <CircleBackground onClick={() => setTimeSelectionOpen(true)} />
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
                <input
                  type="file"
                  onChange={e => handleImageUpload(e, 'bottom')}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </FileInputContainer>
            )}
          </BottomSquare>
          <SettingsIcon onClick={() => {
            setSettingsOpen(true);
            setTimeSelectionOpen(true);
          }} />
          <Modal open={settingsOpen}>
            <h3>Notification Sound:</h3>
            <SoundSelect onChange={(e) => setSelectedNotificationSound(e.target.value)}>
              <option value="">None</option>
              {notificationSounds.map(sound => (
                <option key={sound.url} value={sound.url}>
                  {sound.name}
                </option>
              ))}
            </SoundSelect>
            <h3>Time Selection:</h3>
            {timeSelectionOpen && (
             <>
             <Slider
               value={isFocusTimer ? focusTime : breakTime}
               onChange={(event, value) => selectTime(value)}
               step={300}
               marks={[
                 { value: 1500, label: '25 mins' },
                 { value: 3600, label: '60 mins' },
                 { value: 7200, label: '120 mins' },
               ]}
               max={7200}
               min={300}
               aria-labelledby="focus-time-slider"
               style={{ width: '190%', marginLeft: '10%' }} 
             />
             <Slider
               value={isFocusTimer ? breakTime : focusTime}
               onChange={(event, value) => selectTime(value)}
               step={300}
               marks={[
                 { value: 300, label: '5 mins' },
                 { value: 600, label: '10 mins' },
                 { value: 900, label: '15 mins' },
               ]}
               max={1800}
               min={300}
               aria-labelledby="break-time-slider"
               style={{ width: '190%', marginLeft: '10%' }} 
             />
           </>
           
            )}
            <TimeButtonContainer>
              <button onClick={() => selectTimerType(true)}>Focus</button>
              <button onClick={() => selectTimerType(false)}>Break</button>
              <button onClick={setTimeFromSelection}>OK</button>
            </TimeButtonContainer>
          </Modal>
        </CircleContainer>
        <ButtonContainer>
          <FaRedo
            onClick={resetTimer}
            style={{ fontSize: '24px', cursor: 'pointer' }}
          />
          {!isRunning ? (
            <FaPlay
              onClick={startTimer}
              style={{ fontSize: '24px', cursor: 'pointer' }}
            />
          ) : (
            <FaPause
              onClick={pauseTimer}
              style={{ fontSize: '24px', cursor: 'pointer' }}
            />
          )}
          <FaForward
            onClick={skipTimer}
            style={{ fontSize: '24px', cursor: 'pointer' }}
          />
        </ButtonContainer>
      </PomodoroContainer>
    </ThemeProvider>
  );
};

export default PomodoroTimer;
