/// <reference types="@workadventure/iframe-api-typings" />

WA.onInit().then(async () => {
  await WA.players.configureTracking({
    players: true,
  });

  const scoresListElement = document.getElementById(
    "scoresList"
  ) as HTMLUListElement;
  const scoreRowTemplate = document.getElementById(
    "score-row"
  ) as HTMLTemplateElement;

  const playerLaVoix = [...WA.players.list()].find((player) => {
    return player.name === "La Voix";
  });

  console.log("playerLaVoix", playerLaVoix);

  let scores: Record<
    string,
    { quiz: number; guessWho: number; flopStory: number }
  >;

  if (WA.player.state.hasVariable("scores")) {
    scores = WA.player.state.loadVariable("scores") as Record<
      string,
      { quiz: number; guessWho: number; flopStory: number }
    >;
  } else {
    scores = playerLaVoix?.state.scores as Record<
      string,
      { quiz: number; guessWho: number; flopStory: number }
    >;
  }

  console.log(scores);

  // calcul du score global et création du tableau de joueurs avec scores
  const playersWithTotalScores = Object.keys(scores).map((playerName) => {
    const playerScores = scores[playerName];
    return {
      playerName,
      totalScore:
        playerScores.quiz +
        playerScores.guessWho +
        (playerScores.flopStory || 0),
    };
  });

  // On tri les joueurs par score total décroissant
  playersWithTotalScores.sort((a, b) => b.totalScore - a.totalScore);

  // On affiche les scores
  for (let i = 0; i < playersWithTotalScores.length; i++) {
    const player = playersWithTotalScores[i];
    const scoreRow = scoreRowTemplate.content.cloneNode(true) as HTMLLIElement;
    const [playerPositionElement, playerNameElement] = [
      ...scoreRow.querySelectorAll("span").values(),
    ];

    const position = i + 1;

    playerPositionElement.textContent = position.toString();
    playerNameElement.textContent = player.playerName;

    scoresListElement.appendChild(scoreRow);
  }
});

export {};
