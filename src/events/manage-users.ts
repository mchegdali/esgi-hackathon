import { PLAYERS_COUNT_NEEDED } from "../config";

export default async function manageUsers(isAdmin: boolean) {
  if (isAdmin) {
    await WA.player.setOutlineColor(0, 0, 0);
  }

  if (isAdmin) {
    // manage players count
    WA.players.onVariableChange("inFlopZone").subscribe(({ value, player }) => {
      WA.chat.sendChatMessage(
        `Le joueur ${player.name} est dans la zone 'Flop Stories'`
      );

      const currentPlayerCount = WA.player.state.loadVariable(
        "playerCount:flopStoryZone"
      ) as number;

      const newPlayerCount = !!value
        ? currentPlayerCount + 1
        : currentPlayerCount - 1;

      WA.player.state.saveVariable(
        "playerCount:flopStoryZone",
        newPlayerCount,
        {
          public: false,
          scope: "room",
          persist: false,
        }
      );
    });

    WA.players.onVariableChange("inQuizZone").subscribe(({ value, player }) => {
      WA.chat.sendChatMessage(
        `Le joueur ${player.name} est dans la zone 'Quiz'`
      );
      const currentPlayerCount = WA.player.state.loadVariable(
        "playerCount:quizZone"
      ) as number;

      const newPlayerCount = !!value
        ? currentPlayerCount + 1
        : currentPlayerCount - 1;

      WA.player.state.saveVariable("playerCount:quizZone", newPlayerCount, {
        public: false,
        scope: "room",
        persist: false,
      });
    });

    WA.players
      .onVariableChange("inGuessZone")
      .subscribe(({ value, player }) => {
        WA.chat.sendChatMessage(
          `Le joueur ${player.name} est dans la zone 'Devine Qui?'`
        );
        const currentPlayerCount = WA.player.state.loadVariable(
          "playerCount:guessZone"
        ) as number;

        const newPlayerCount = !!value
          ? currentPlayerCount + 1
          : currentPlayerCount - 1;

        WA.player.state.saveVariable("playerCount:guessZone", newPlayerCount, {
          public: false,
          scope: "room",
          persist: false,
        });
      });

    WA.player.state
      .onVariableChange("playerCount:guessZone")
      .subscribe((value) => {
        WA.ui.actionBar.removeButton("start-guess-the-person-btn");
        if (value === PLAYERS_COUNT_NEEDED) {
          WA.ui.actionBar.addButton({
            id: "start-guess-the-person-btn",
            label: `Lancer le jeu 'Devine Qui?'`,

            callback: () => {
              console.log(`start event: 'Devine Qui?'`);
            },
          });
        }
      });
  } else {
    //#region flopStoryZone
    WA.room.area.onEnter("flopStoryZone").subscribe(async () => {
      await WA.player.state.saveVariable("inFlopZone", true, {
        public: true,
        scope: "room",
        persist: false,
      });
    });

    WA.room.area.onLeave("flopStoryZone").subscribe(async () => {
      await WA.player.state.saveVariable("inFlopZone", false, {
        public: true,
        scope: "room",
        persist: false,
      });
    });
    //#endregion

    //#region quizZone
    WA.room.area.onEnter("quizZone").subscribe(async () => {
      await WA.player.state.saveVariable("inQuizZone", true, {
        public: true,
        scope: "room",
        persist: false,
      });
    });

    WA.room.area.onLeave("quizZone").subscribe(async () => {
      await WA.player.state.saveVariable("inQuizZone", false, {
        public: true,
        scope: "room",
        persist: false,
      });
    });
    //#endregion

    //#region guessZone
    WA.room.area.onEnter("guessZone").subscribe(async () => {
      await WA.player.state.saveVariable("inGuessZone", true, {
        public: true,
        scope: "room",
        persist: false,
      });
    });

    WA.room.area.onLeave("guessZone").subscribe(async () => {
      await WA.player.state.saveVariable("inGuessZone", false, {
        public: true,
        scope: "room",
        persist: false,
      });
    });
    //#endregion
  }
}
