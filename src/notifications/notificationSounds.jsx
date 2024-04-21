import sound1 from './Putang Ina Mo.mp3';
import sound2 from './inamoAaron.mp3';
export const getNotificationSounds = () => {
    const sounds = [
      { name: 'Putang inamo', url: sound1 },
      { name: 'Inamo Aaron', url: sound2 },
    ];
    return sounds;
};
