/// <reference types="@workadventure/iframe-api-typings" />
import { rootLink } from '../../config';
import runFlopStoriesEvent from './run';

/**
 * Nombre de joueurs nécessaires pour lancer l'événement
 */
const PLAYERS_READY_COUNT_NEEDED = 1;

/**
 * Chaque personne soumet une de ses pires histoires et lit de manière aléatoire l’histoire d’un autre joueur.
 * Les joueurs votent pour l'histoire qu'ils jugent la plus folle ou ridicule.
 */
function initFlopStoriesEvent() {
  const isAdmin = WA.player.tags.includes('admin');

  if (isAdmin) {
    WA.players.onVariableChange('inFlopStoriesArea').subscribe(({ value }) => {
      const currentPlayerCount =
        Number(WA.player.state.loadVariable('playerCount')) ?? -1; // -1 to exclude the admin

      const newPlayerCount = !!value
        ? currentPlayerCount + 1
        : currentPlayerCount - 1;

      WA.player.state.saveVariable('playerCount', newPlayerCount, {
        public: false,
        scope: 'room',
        persist: false,
      });
    });
  }

  WA.room.area.onEnter('flop-stories-area').subscribe(() => {
    if (isAdmin) {
      WA.players
        .onVariableChange('inFlopStoriesArea')
        .subscribe(({ value }) => {
          const currentPlayerCount =
            Number(WA.player.state.loadVariable('playerCount')) ?? -1; // -1 to exclude the admin

          const newPlayerCount = !!value
            ? currentPlayerCount + 1
            : currentPlayerCount - 1;

          WA.player.state.saveVariable('playerCount', newPlayerCount, {
            public: false,
            scope: 'room',
            persist: false,
          });
        });
    } else {
      WA.player.state.saveVariable('inFlopStoriesArea', true, {
        public: true,
        scope: 'room',
        persist: false,
      });
    }
  });

  WA.room.area.onEnter('flop-stories-area').subscribe(() => {
    if (WA.player.tags.includes('admin')) {
      WA.players
        .onVariableChange('inFlopStoriesArea')
        .subscribe(({ value }) => {
          const currentPlayerCount =
            Number(WA.player.state.loadVariable('playerCount')) ?? -1; // -1 to exclude the admin

          const newPlayerCount = !!value
            ? currentPlayerCount + 1
            : currentPlayerCount - 1;

          WA.player.state.saveVariable('playerCount', newPlayerCount, {
            public: false,
            scope: 'room',
            persist: false,
          });
        });
    } else {
      WA.player.state.saveVariable('inFlopStoriesArea', true, {
        public: true,
        scope: 'room',
        persist: false,
      });
    }
  });

  // const flopStoriesEventAreaEnterSubscription = WA.room.area
  //   .onEnter('flop-stories-area')
  //   .subscribe(() => {
  //     WA.players.onPlayerEnters.subscribe((player) => {
  //       let currentPlayerCount =
  //         Number(WA.player.state.loadVariable('playerCount')) ?? 0;

  //       if (
  //         player.uuid !== WA.player.uuid &&
  //         !WA.player.tags.includes('admin')
  //       ) {
  //         currentPlayerCount++;

  //         // WA.chat.sendChatMessage(`${player.name} est prêt`);
  //         console.log(`${player.name} est dans la zone de jeu`);
  //       }
  //     });
  //   });

  // WA.room.area.onLeave('flop-stories-area').subscribe(() => {
  //   flopStoriesEventAreaEnterSubscription.unsubscribe();
  // });
}

export default initFlopStoriesEvent;
