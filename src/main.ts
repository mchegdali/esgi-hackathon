/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from '@workadventure/scripting-api-extra';

console.log('Script started successfully');

let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit()
  .then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ', WA.player.tags);

    WA.room.onEnterLayer('start').subscribe(() => {
      WA.ui.modal.openModal(
        {
          title: 'WorkAdventure website',
          src: window.location.origin,
          allow: 'fullscreen',
          allowApi: true,
          position: 'center',
        },
        () => {
          console.log('Modal closed');
        }
      );

      WA.chat.sendChatMessage(
        `${WA.player.name} a rejoint le monde de FlopStory !`
      );

      WA.ui.displayActionMessage({
        message: 'Bienvenue dans le monde de FlopStory !',
        callback: () => {},
      });
    });

    WA.room.area.onEnter('landing').subscribe(() => {
      WA.ui.displayActionMessage({
        message: 'Bienvenue dans le monde de FlopStory !',
        callback: () => {},
      });
    });

    WA.room.area.onEnter('clock').subscribe(() => {
      const today = new Date();
      const time = today.getHours() + ':' + today.getMinutes();
      currentPopup = WA.ui.openPopup('clockPopup', "It's " + time, []);
    });

    WA.room.area.onLeave('clock').subscribe(closePopup);

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra()
      .then(() => {
        console.log('Scripting API Extra ready');
      })
      .catch((e) => console.error(e));
  })
  .catch((e) => console.error(e));

function closePopup() {
  if (currentPopup !== undefined) {
    currentPopup.close();
    currentPopup = undefined;
  }
}

export {};
