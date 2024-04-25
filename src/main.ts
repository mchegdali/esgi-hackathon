/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from '@workadventure/scripting-api-extra';
import initFlopStoriesEvent from './events/flop-stories/init';
import onFirstTimeEnter from './events/on-first-time-enter';

console.log('Script started successfully');

// Waiting for the API to be ready
WA.onInit()
  .then(() => {
    document.styleSheets.item(0)?.insertRule('#');
    console.log('Scripting API ready');
    console.log('Player tags: ', WA.player.tags);

    onFirstTimeEnter();
    initFlopStoriesEvent();

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra()
      .then(() => {
        console.log('Scripting API Extra ready');
      })
      .catch((e) => console.error(e));
  })
  .catch((e) => console.error(e));

export {};
