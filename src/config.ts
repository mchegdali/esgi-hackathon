// @ts-ignore
const rootLink = import.meta.env.BASE_URL;
const PLAYERS_COUNT_NEEDED = 1;

const eventAreas = [
  {
    areaName: 'flopStoryZone',
    variableName: 'inFlopStoriesArea',
    btnId: 'start-flop-stories-btn',
    eventName: 'Flop Stories',
  },
  {
    areaName: 'quizZone',
    variableName: 'inQuizArea',
    btnId: 'start-quiz-btn',
    eventName: 'Quiz',
  },
  {
    areaName: 'guessZone',
    variableName: 'inGuessThePersonArea',
    btnId: 'start-guess-the-person-btn',
    eventName: 'Devine Qui?',
  },
];

export { rootLink, PLAYERS_COUNT_NEEDED, eventAreas };
