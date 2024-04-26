/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from '@workadventure/scripting-api-extra';
import onFirstTimeEnter from './events/on-first-time-enter';
import manageUsers from './events/manage-users';

console.log('Script started successfully');

// Waiting for the API to be ready
WA.onInit()
  .then(async () => {
    await WA.players.configureTracking({
      players: true,
    });
    console.log('Scripting API ready');
    //const isAdmin = WA.player.tags.includes('admin');
    const isAdmin = WA.player.name === 'La Voix';
    if (isAdmin) {
      const adminActionMessage = WA.ui.displayActionMessage({
        message: 'Vous êtes administrateur.',
        callback: () => {},
      });

      setTimeout(async () => {
        await adminActionMessage.remove();
      }, 5000);
    }
    console.log('Player tags: ', WA.player.tags);

    onFirstTimeEnter();
    await manageUsers();
    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra()
      .then(() => {
        console.log('Scripting API Extra ready');
      })
      .catch((e) => console.error(e));
  })
  .catch((e) => console.error(e));

export {};
