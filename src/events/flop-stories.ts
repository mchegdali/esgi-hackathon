/// <reference types="@workadventure/iframe-api-typings" />

import playerHasEnteredArea from '../utils/player-has-entered-area';
import playerHasLeftArea from '../utils/player-has-left-area';
/**
 * Chaque personne soumet une de ses pires histoires et lit de manière aléatoire l’histoire d’un autre joueur.
 * Les joueurs doivent essayer de deviner à qui appartient l’histoire. Celui qui devine le plus vite gagne plus de points.
 */

function flopStoriesEvent() {
  playerHasEnteredArea({
    playerName: WA.player.name,
    areaName: 'flop-stories',
  });
  playerHasLeftArea({
    playerName: WA.player.name,
    areaName: 'flop-stories',
  });
}

export default flopStoriesEvent;
