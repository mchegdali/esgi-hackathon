const rootLink = 'http://localhost:5173';
const PLAYERS_COUNT_NEEDED = 1;

const eventAreas = [
  {
    areaName: 'flop-stories-area',
    variableName: 'inFlopStoriesArea',
    btnId: 'start-flop-stories-btn',
    eventName: 'Flop Stories',
  },
  {
    areaName: 'quiz-area',
    variableName: 'inQuizArea',
    btnId: 'start-quiz-btn',
    eventName: 'Quiz',
  },
  {
    areaName: 'guess-the-person-area',
    variableName: 'inGuessThePersonArea',
    btnId: 'start-guess-the-person-btn',
    eventName: 'Devine Qui?',
  },
];

export { rootLink, PLAYERS_COUNT_NEEDED, eventAreas };
