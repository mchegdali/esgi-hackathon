// @ts-ignore
const rootLink = import.meta.env.PROD
  ? // @ts-ignore
    import.meta.env.BASE_URL
  : "http://localhost:5173";

const PLAYERS_COUNT_NEEDED = 1;

export { rootLink, PLAYERS_COUNT_NEEDED };
