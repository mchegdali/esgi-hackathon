/// <reference types="@workadventure/iframe-api-typings" />

WA.onInit().then(async () => {
  const scoresListElement = document.getElementById(
    "scoresList"
  ) as HTMLUListElement;
  const scores = WA.player.state.loadVariable("scores") as Record<
    string,
    { quiz: number; guessWho: number; flopStory: number }
  >;

  // calcul du score global et création du tableau de joueurs avec scores
  const playersWithTotalScores = Object.keys(scores).map((playerId) => {
    const playerScores = scores[playerId];
    const totalScore =
      playerScores.quiz + playerScores.guessWho + playerScores.flopStory; // Somme des scores des différents jeux
    return { playerId, totalScore, ...playerScores };
  });

  // On tri les joueurs par score total décroissant
  playersWithTotalScores.sort((a, b) => b.totalScore - a.totalScore);
});

export {};
