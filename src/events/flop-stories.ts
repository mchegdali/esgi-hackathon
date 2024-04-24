/// <reference types="@workadventure/iframe-api-typings" />

/**
 * Chaque personne soumet une de ses pires histoires et lit de manière aléatoire l’histoire d’un autre joueur.
 * Les joueurs doivent essayer de deviner à qui appartient l’histoire. Celui qui devine le plus vite gagne plus de points.
 */

function flopStoriesEvent() {
  WA.room.area.onEnter('event-flopstories').subscribe(() => {});
}
