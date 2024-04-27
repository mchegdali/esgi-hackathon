/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import onFirstTimeEnter from "./events/on-first-time-enter";
import manageUsers from "./events/manage-users";
import { QuizManager } from "./quizManager";
import { FlopStoryManager } from "./flopStoryManager";
import { rootLink } from "./config";
import restoreAllControls from "./utils/restore-all-controls";

console.log("Script started successfully");

let currentModal: any = undefined;

let quizManager = new QuizManager(WA);
let flopStoryManager = new FlopStoryManager(
  WA,
  showEventModal,
  closeEventModal
);

const audioFiles = [
  {
    name: "bienvenu.mp3",
    htmlSrc: "http://localhost:5173/templates/bienvenu.html",
  },
  {
    name: "mission_quiz.mp3",
    htmlSrc: "http://localhost:5173/templates/mission_quiz.html",
  },
  {
    name: "regle_quiz.mp3",
    htmlSrc: "http://localhost:5173/templates/regle_quiz.html",
  },
  {
    name: "mission_devine_qui.mp3",
    htmlSrc: "http://localhost:5173/templates/mission_devine_qui.html",
  },
  {
    name: "regle_devine_qui.mp3",
    htmlSrc: "http://localhost:5173/templates/regle_devine_qui.html",
  },
  {
    name: "mission_flop_story.mp3",
    htmlSrc: "http://localhost:5173/templates/mission_flop_story.html",
  },
  {
    name: "regle_flop_story.mp3",
    htmlSrc: "http://localhost:5173/templates/regle_flop_story.html",
  },
];

// Waiting for the API to be ready
WA.onInit()
  .then(async () => {
    await WA.players.configureTracking({
      players: true,
    });

    onFirstTimeEnter();

    const isAdmin = WA.player.tags.includes("admin");

    //#region Quiz
    if (!isAdmin) {
      // Déclencheur pour le quiz
      WA.room.area.onEnter("quizZone").subscribe(async () => {
        if (!WA.player.state.hasVariable("quizScore")) {
          quizManager.openQuiz();
        }
      });

      // Déclencheur pour fermer le quiz
      WA.room.area.onLeave("quizZone").subscribe(() => {
        //// Ferme le modal du quiz
        quizManager.closeQuiz();
      });

      WA.player.state.onVariableChange("quizScore").subscribe((newValue) => {
        const totalQuestions = JSON.parse(
          WA.state.loadVariable("quizQuestions") as string
        ) as unknown[];
        const actionMessage = WA.ui.displayActionMessage({
          message: `Vous avez eu ${newValue} bonnes réponses sur ${totalQuestions.length} possibles.`,
          callback: () => {},
        });

        setTimeout(async () => {
          await actionMessage.remove();
        }, 5000);
      });
    }
    //#endregion

    //#region Guess Who
    if (!isAdmin) {
      WA.room.area.onEnter("guessZone").subscribe(async () => {
        if (
          WA.player.state.hasVariable("quizScore") &&
          !WA.player.state.hasVariable("guessWhoScore")
        ) {
          WA.ui.modal.openModal(
            {
              title: "Devine qui ?",
              src: `${rootLink}/modals/guess-who/index.html`,
              allow: null,
              allowApi: true,
              position: "center",
            },
            () => {
              restoreAllControls();
            }
          );
        }
      });

      WA.room.area.onLeave("guessZone").subscribe(() => {
        WA.ui.modal.closeModal();
      });

      WA.player.state
        .onVariableChange("guessWhoScore")
        .subscribe((newValue) => {
          const totalCharacters = JSON.parse(
            WA.state.loadVariable("guessWhoQuestions") as string
          ) as unknown[];
          const actionMessage = WA.ui.displayActionMessage({
            message: `Vous avez eu ${newValue} bonnes réponses sur ${totalCharacters.length} possibles.`,
            callback: () => {},
          });

          setTimeout(async () => {
            await actionMessage.remove();
          }, 5000);
        });
    }
    //#endregion

    //#region Flop Story
    // Déclencheur pour flop story
    if (!isAdmin) {
      WA.room.area.onEnter("flopStoryZone").subscribe(() => {
        if (
          WA.player.state.hasVariable("quizScore") &&
          WA.player.state.hasVariable("guessWhoScore") &&
          !WA.player.state.hasVariable("flopStoryScore")
        ) {
          flopStoryManager.openFlopStory();
        }
      });

      // Déclencheur pour fermer flop story
      WA.room.area.onLeave("flopStoryZone").subscribe(() => {
        //// Ferme le modal de flop story
        flopStoryManager.closeFlopStory();
      });
    }
    //#endregion

    //#region admin
    if (isAdmin) {
      const adminActionMessage = WA.ui.displayActionMessage({
        message: "Vous êtes administrateur.",
        callback: () => {},
      });

      setTimeout(async () => {
        await adminActionMessage.remove();
      }, 5000);

      WA.players
        .onVariableChange("quizScore")
        .subscribe(({ player, value }) => {
          const currentScores = (WA.player.state.loadVariable("scores") ??
            {}) as Record<
            string,
            {
              quiz: number;
              guessWho: number;
              flopStory: number;
            }
          >;

          WA.player.state.saveVariable("scores", {
            ...currentScores,
            [player.playerId]: {
              ...currentScores[player.playerId],
              quiz: value,
            },
          });
        });

      WA.players
        .onVariableChange("guessWhoScore")
        .subscribe(({ player, value }) => {
          const currentScores = (WA.player.state.loadVariable("scores") ??
            {}) as Record<
            string,
            {
              quiz: number;
              guessWho: number;
              flopStory: number;
            }
          >;

          WA.player.state.saveVariable("scores", {
            ...currentScores,
            [player.playerId]: {
              ...currentScores[player.playerId],
              guess: value,
            },
          });
        });

      WA.players
        .onVariableChange("flopStoryScore")
        .subscribe(({ player, value }) => {
          const currentScores = (WA.player.state.loadVariable("scores") ??
            {}) as Record<
            string,
            {
              quiz: number;
              guessWho: number;
              flopStory: number;
            }
          >;

          WA.player.state.saveVariable("scores", {
            ...currentScores,
            [player.playerId]: {
              ...currentScores[player.playerId],
              flopStory: value,
            },
          });
        });
    }
    //#endregion
    //Afficher/Masquer les portes pour voir les tunnels
    setupDoorTriggers("right_door_zone", "doors/door_right");
    setupDoorTriggers("center_door_zone", "doors/door_center");
    setupDoorTriggers("left_door_zone", "doors/door_left");

    await manageUsers();
    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra()
      .then(() => {
        console.log("Scripting API Extra ready");
      })
      .catch((e) => console.error(e));

    // On appelle la vérification du temps avec la date et heure cibles
    const eventDate = new Date("2024-04-25T20:45:00");
    checkTimeAndTriggerEvent(eventDate);
  })
  .catch((e) => console.error(e));

//Fonction pour écouter un audio
function playAudio(audioFile: string) {
  var sound = WA.sound.loadSound("../sounds/" + audioFile);
  var config = {
    volume: 0.5,
    loop: false,
    rate: 1,
    detune: 1,
    delay: 0,
    seek: 0,
    mute: false,
  };
  sound.play(config);
}

// Fonction pour faire écouter un audio + afficher le modal associé
function triggerEvent(
  audioFile: string,
  src: string,
  position: "left" | "right" | "center"
) {
  playAudio(audioFile);
  showEventModal(src, position); // Affiche le popup
}

// Fonction pour vérifier l'heure et déclencher l'événement
function checkTimeAndTriggerEvent(targetTime: Date) {
  const now = new Date();
  const delay = targetTime.getTime() - now.getTime();

  if (delay > 0) {
    setTimeout(() => {
      triggerEvent(audioFiles[0].name, audioFiles[0].htmlSrc, "right");
    }, delay);
  }
}

//Fonction pour afficher un modal
function showEventModal(src: string, position: "left" | "right" | "center") {
  if (currentModal !== undefined) {
    WA.ui.modal.closeModal(); // Ferme le modal précédent s'il existe
    currentModal = undefined;
  }
  currentModal = WA.ui.modal.openModal({
    title: "Titre", // Titre du modal
    src: src, // Source HTML ou URL pour le contenu du modal
    allow: "fullscreen",
    allowApi: true,
    position: position, // Position du modal
  });
}

//Fonction pour fermer un modal
function closeEventModal() {
  if (currentModal !== undefined) {
    WA.ui.modal.closeModal(); // Ferme le modal précédent s'il existe
    currentModal = undefined;
    WA.controls.restorePlayerControls();
  }
}

//Fonction pour afficher/masquer les portes
function setupDoorTriggers(zoneName: string, layerName: string) {
  WA.room.area.onEnter(zoneName).subscribe(() => {
    WA.room.hideLayer(layerName);
  });

  WA.room.area.onLeave(zoneName).subscribe(() => {
    WA.room.showLayer(layerName);
  });
}

export {};
