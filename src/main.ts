/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from '@workadventure/scripting-api-extra';
import playerHasEnteredArea from './utils/player-has-entered-area';
import { rootLink } from './config';

console.log('Script started successfully');

// Waiting for the API to be ready
WA.onInit()
  .then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ', WA.player.tags);

    WA.room.onEnterLayer('start').subscribe(() => {
      playerHasEnteredArea({ playerName: WA.player.name, areaName: 'start' });

      if (!WA.player.state.loadVariable('ftue')) {
        // First Time User Experience = FTUE
        WA.controls.disablePlayerControls();
        WA.controls.disablePlayerProximityMeeting();
        WA.controls.disableWebcam();
        WA.controls.disableMicrophone();

        WA.ui.modal.openModal(
          {
            title: 'WorkAdventure website',
            src: `${rootLink}/modals/welcome/index.html`,
            // src: `https://workadventu.re`,
            allow: null,
            allowApi: true,
            position: 'center',
          },
          () => {
            WA.player.state.saveVariable('ftue', true, {
              public: false,
              scope: 'world',
              persist: true,
            });
          }
        );

        WA.chat.sendChatMessage(
          `${WA.player.name} a rejoint le monde de FlopStory ! Souhaitez-lui la bienvenue !`
        );
      }
    });

    WA.room.onLeaveLayer('start').subscribe(async () => {
      await WA.player.setOutlineColor(0, 0, 255);

      WA.controls.restorePlayerControls();
      WA.controls.restorePlayerProximityMeeting();
      WA.controls.restoreWebcam();
      WA.controls.restoreMicrophone();
    });

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra()
      .then(() => {
        console.log('Scripting API Extra ready');
      })
      .catch((e) => console.error(e));
  })
  .catch((e) => console.error(e));

export {};
