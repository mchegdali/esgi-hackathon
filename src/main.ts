/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import onFirstTimeEnter from "./events/on-first-time-enter";
import manageUsers from "./events/manage-users";
import { QuizManager } from "./quizManager";
import { FlopStoryManager } from "./flopStoryManager";
import { rootLink } from "./config";
import restoreAllControls from "./utils/restore-all-controls";
import { Sound } from "@workadventure/iframe-api-typings";
import { SoundConfig } from "@workadventure/iframe-api-typings/play/src/front/Api/Iframe/Sound/Sound";

interface FlopStory {
  playerId: number;
  story: string;
}

let currentModal: any = undefined;
let currentSound: Sound;

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
          WA.event.on("quiz:start").subscribe(() => {
            quizManager.openQuiz();
          });
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
          WA.event.on("guess:start").subscribe(() => {
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
          });
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
          !WA.player.state.hasVariable("chosenFlop")
        ) {
          WA.event.on("flop:start").subscribe(() => {
            flopStoryManager.openFlopStory();
          });
        }
      });

      // Déclencheur pour fermer flop story
      WA.room.area.onLeave("flopStoryZone").subscribe(() => {
        //// Ferme le modal de flop story
        flopStoryManager.closeFlopStory();
      });
    }
    //#endregion

    //#region Events
    //#region Manage events for admin
    if (isAdmin) {
      WA.ui.actionBar.addButton({
        id: "open-quiz-btn",
        label: "Ouvrir la salle de quiz",
        callback: async () => {
          const [area] = await Promise.all([
            WA.room.area.get("quizZone"),
            WA.event.broadcast("quiz:open", null),
            WA.state.saveVariable("quizDoor", true),
            WA.player.teleport(528, 432),
          ]);
          WA.camera.set(
            area.x + area.width / 2,
            area.y + area.height / 2,
            area.width,
            area.height,
            true,
            true
          );
        },
      });

      WA.event.on("quiz:open").subscribe(() => {
        WA.ui.actionBar.removeButton("open-quiz-btn");
        WA.ui.actionBar.addButton({
          id: "start-quiz-btn",
          label: "Démarrer le quiz",
          callback: async () => {
            await WA.event.broadcast("quiz:start", null);
          },
        });
      });

      WA.event.on("quiz:start").subscribe(() => {
        WA.ui.actionBar.removeButton("start-quiz-btn");

        WA.ui.actionBar.addButton({
          id: "end-quiz-btn",
          label: "Terminer le quiz",
          callback: async () => {
            await WA.event.broadcast("quiz:end", null);
          },
        });
      });

      WA.event.on("quiz:end").subscribe(() => {
        WA.ui.actionBar.removeButton("end-quiz-btn");
        WA.ui.actionBar.addButton({
          id: "open-guess-btn",
          label: "Ouvrir le Devine qui ?",
          callback: async () => {
            const [area] = await Promise.all([
              WA.room.area.get("guessZone"),
              WA.event.broadcast("guess:open", null),
              WA.state.saveVariable("guessDoor", true),
              WA.player.teleport(1120, 512),
            ]);
            WA.camera.set(
              area.x + area.width / 2,
              area.y + area.height / 2,
              area.width,
              area.height,
              true,
              true
            );
          },
        });
      });

      WA.event.on("guess:open").subscribe(() => {
        WA.ui.actionBar.removeButton("open-guess-btn");
        WA.ui.actionBar.addButton({
          id: "start-guess-btn",
          label: "Démarrer le Devine qui ?",
          callback: async () => {
            await WA.event.broadcast("guess:start", null);
          },
        });
      });

      WA.event.on("guess:start").subscribe(() => {
        WA.ui.actionBar.removeButton("start-guess-btn");
        WA.ui.actionBar.addButton({
          id: "end-guess-btn",
          label: "Terminer le Devine qui ?",
          callback: async () => {
            await WA.event.broadcast("guess:end", null);
          },
        });
      });

      WA.event.on("guess:end").subscribe(() => {
        WA.ui.actionBar.removeButton("end-guess-btn");
        WA.ui.actionBar.addButton({
          id: "open-flop-btn",
          label: "Ouvrir le Flop Stories",
          callback: async () => {
            const [area] = await Promise.all([
              WA.room.area.get("flopStoryZone"),
              WA.event.broadcast("flop:open", null),
              WA.state.saveVariable("flopDoor", true),
              WA.player.teleport(1744, 512),
            ]);
            WA.camera.set(
              area.x + area.width / 2,
              area.y + area.height / 2,
              area.width,
              area.height,
              true,
              true
            );
          },
        });
      });

      WA.event.on("flop:open").subscribe(() => {
        WA.ui.actionBar.removeButton("open-flop-btn");
        WA.ui.actionBar.addButton({
          id: "start-flop-btn",
          label: "Démarrer le Flop Story",
          callback: async () => {
            await WA.event.broadcast("flop:start", null);
          },
        });
      });

      WA.event.on("flop:start").subscribe(() => {
        WA.ui.actionBar.removeButton("start-flop-btn");
        WA.ui.actionBar.addButton({
          id: "end-flop-btn",
          label: "Terminer le Flop Story",
          callback: async () => {
            await WA.event.broadcast("flop:end", null);
          },
        });
      });

      WA.event.on("flop:end").subscribe(() => {
        WA.ui.actionBar.removeButton("end-flop-btn");
      });
    }
    //#endregion

    WA.event.on("quiz:open").subscribe(() => {
      playAudio(audioFiles[1].name);
    });

    WA.event.on("quiz:start").subscribe(() => {
      playAudio(audioFiles[2].name);
    });

    WA.event.on("guess:open").subscribe(() => {
      playAudio(audioFiles[3].name);
    });

    WA.event.on("guess:start").subscribe(() => {
      playAudio(audioFiles[4].name);
    });

    WA.event.on("flop:open").subscribe(() => {
      playAudio(audioFiles[5].name);
    });

    WA.event.on("flop:start").subscribe(() => {
      playAudio(audioFiles[6].name);
    });

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
        .onVariableChange("chosenFlop")
        .subscribe(({ player, value }) => {
          const chosenPlayerId = value as FlopStory["playerId"];
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
            [chosenPlayerId]: {
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
  })
  .catch((e) => console.error(e));

//Fonction pour écouter un audio
function playAudio(audioFile: string) {
  if (currentSound) {
    currentSound.stop();
  }
  currentSound = WA.sound.loadSound("../sounds/" + audioFile);
  const config: SoundConfig = {
    volume: 0.5,
    loop: false,
    rate: 1,
    detune: 1,
    delay: 0,
    seek: 0,
    mute: false,
  };
  currentSound.play(config);
}

//Fonction pour afficher un modal
function showEventModal(src: string, position: "left" | "right" | "center") {
  WA.ui.modal.closeModal();
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
    const guessDoor = WA.state.loadVariable("guessDoor") as boolean;
    if (guessDoor) {
      WA.room.hideLayer(layerName);
      WA.room.hideLayer(`${layerName}_block`);
      WA.room.showLayer(`${layerName}_open`);
    }
  });
  WA.room.area.onLeave(zoneName).subscribe(() => {
    WA.room.showLayer(layerName);
    WA.room.showLayer(`${layerName}_block`);
    WA.room.hideLayer(`${layerName}_open`);
  });
}

export {};
