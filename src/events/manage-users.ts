import { PLAYERS_COUNT_NEEDED } from '../config';

export default async function manageUsers() {
  // manage styles
  const isAdmin = WA.player.tags.includes('admin');

  if (isAdmin) {
    await WA.player.setOutlineColor(0, 0, 0);
  }

  if (isAdmin) {
    // manage players count
    WA.players.onVariableChange('inFlopStoriesArea').subscribe(({ value }) => {
      const currentPlayerCount = WA.player.state.loadVariable(
        'playerCount:flopStoryZone'
      ) as number;

      const newPlayerCount = !!value
        ? currentPlayerCount + 1
        : currentPlayerCount - 1;

      WA.player.state.saveVariable(
        'playerCount:flopStoryZone',
        newPlayerCount,
        {
          public: false,
          scope: 'room',
          persist: false,
        }
      );
    });

    WA.players.onVariableChange('inQuizArea').subscribe(({ value }) => {
      const currentPlayerCount = WA.player.state.loadVariable(
        'playerCount:quizZone'
      ) as number;

      const newPlayerCount = !!value
        ? currentPlayerCount + 1
        : currentPlayerCount - 1;

      WA.player.state.saveVariable('playerCount:quizZone', newPlayerCount, {
        public: false,
        scope: 'room',
        persist: false,
      });
    });

    WA.players
      .onVariableChange('inGuessThePersonArea')
      .subscribe(({ value }) => {
        const currentPlayerCount = WA.player.state.loadVariable(
          'playerCount:guessZone'
        ) as number;

        const newPlayerCount = !!value
          ? currentPlayerCount + 1
          : currentPlayerCount - 1;

        WA.player.state.saveVariable('playerCount:guessZone', newPlayerCount, {
          public: false,
          scope: 'room',
          persist: false,
        });
      });

    // activate area button if all players are in the area
    WA.player.state
      .onVariableChange('playerCount:flopStoryZone')
      .subscribe((value) => {
        WA.ui.actionBar.removeButton('start-flop-stories-btn');
        if (value === PLAYERS_COUNT_NEEDED) {
          WA.ui.actionBar.addButton({
            id: 'start-flop-stories-btn',
            label: `Lancer le jeu 'Flop Stories'`,

            callback: () => {
              console.log(`start event: 'Flop Stories'`);
            },
          });
        }
      });

    WA.player.state
      .onVariableChange('playerCount:quizZone')
      .subscribe((value) => {
        WA.ui.actionBar.removeButton('start-quiz-btn');
        if (value === PLAYERS_COUNT_NEEDED) {
          WA.ui.actionBar.addButton({
            id: 'start-quiz-btn',
            label: `Lancer le jeu 'Quiz'`,

            callback: () => {
              console.log(`start event: 'Quiz'`);
            },
          });
        }
      });

    WA.player.state
      .onVariableChange('playerCount:guessZone')
      .subscribe((value) => {
        WA.ui.actionBar.removeButton('start-guess-the-person-btn');
        if (value === PLAYERS_COUNT_NEEDED) {
          WA.ui.actionBar.addButton({
            id: 'start-guess-the-person-btn',
            label: `Lancer le jeu 'Devine Qui?'`,

            callback: () => {
              console.log(`start event: 'Devine Qui?'`);
            },
          });
        }
      });
  } else {
    //#region flopStoryZone
    WA.room.area.onEnter('flopStoryZone').subscribe(async () => {
      await WA.player.state.saveVariable('inFlopStoriesArea', true, {
        public: true,
        scope: 'room',
        persist: false,
      });
    });

    WA.room.area.onLeave('flopStoryZone').subscribe(async () => {
      await WA.player.state.saveVariable('inFlopStoriesArea', false, {
        public: true,
        scope: 'room',
        persist: false,
      });
    });
    //#endregion

    //#region quizZone
    WA.room.area.onEnter('quizZone').subscribe(async () => {
      await WA.player.state.saveVariable('inQuizArea', true, {
        public: true,
        scope: 'room',
        persist: false,
      });
    });

    WA.room.area.onLeave('quizZone').subscribe(async () => {
      await WA.player.state.saveVariable('inQuizArea', false, {
        public: true,
        scope: 'room',
        persist: false,
      });
    });
    //#endregion

    //#region guessZone
    WA.room.area.onEnter('guessZone').subscribe(async () => {
      await WA.player.state.saveVariable('inGuessThePersonArea', true, {
        public: true,
        scope: 'room',
        persist: false,
      });
    });

    WA.room.area.onLeave('guessZone').subscribe(async () => {
      await WA.player.state.saveVariable('inGuessThePersonArea', false, {
        public: true,
        scope: 'room',
        persist: false,
      });
    });
    //#endregion
  }
}
