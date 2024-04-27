// @ts-ignore
const rootLink = import.meta.env.PROD
  ? // @ts-ignore
    import.meta.env.BASE_URL
  : "http://localhost:5173";

const PLAYERS_COUNT_NEEDED = 1;

const eventAreas = [
  {
    areaName: "flopStoryZone",
    variableName: "inFlopStoriesArea",
    btnId: "start-flop-stories-btn",
    eventName: "Flop Stories",
  },
  {
    areaName: "quizZone",
    variableName: "inQuizArea",
    btnId: "start-quiz-btn",
    eventName: "Quiz",
  },
  {
    areaName: "guessZone",
    variableName: "inGuessThePersonArea",
    btnId: "start-guess-the-person-btn",
    eventName: "Devine Qui?",
  },
];

export { rootLink, PLAYERS_COUNT_NEEDED, eventAreas };
