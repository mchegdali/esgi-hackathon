/// <reference types="@workadventure/iframe-api-typings" />

WA.onInit().then(async () => {
  console.log("Script started successfully flopStory");
  await WA.players.configureTracking();

  //   function submitFlopStory() {
  //     const vote = new Map();
  //     const tabScore = [];

  //     const form = document.getElementById("flopForm");
  //     if (form) {
  //       form.addEventListener("submit", async (e) => {
  //         e.preventDefault();
  //         const fd = new FormData(e.target as HTMLFormElement);
  //         const flop = fd.get("flop");
  //         tabScore.push(flop);

  //         vote.set(WA.player.uuid, vote);
  //         await WA.player.state.saveVariable("flop-stories-questions", vote);

  //         WA.ui.modal.closeModal();
  //       });
  //     }
  //   }

  //   function gestionScore() {
  //     const score = new Map();
  //     let joueur = WA.player.uuid;
  //     // Obtenir le choix de l'utilisateur depuis la fonction submitFlopStory
  //     const selectedFlop = submitFlopStory();

  //     // Vérifier si un choix a été fait
  //     if (selectedFlop) {
  //       // Mettre à jour le score du joueur
  //       score.set("joueur", selectedFlop);
  //       console.log("Le vote est :", score.get("joueur"), "de", joueur);
  //     } else {
  //       console.log("Aucun choix n'a été fait.");
  //     }
  //   }
});

export {};
