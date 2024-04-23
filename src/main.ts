/// <reference types="@workadventure/iframe-api-typings" />

import { ActionMessage } from "@workadventure/iframe-api-typings";
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log("Script started successfully");

let currentPopup: any = undefined;
let currentActionMessage: ActionMessage | undefined = undefined;

// Waiting for the API to be ready
WA.onInit()
  .then(() => {
    console.log("Scripting API ready");
    console.log("Player tags: ", WA.player.tags);

    WA.room.onEnterLayer("start").subscribe(() => {
      if (!WA.player.state.loadVariable("ftue")) {
        WA.ui.modal.openModal(
          {
            title: "WorkAdventure website",
            src: `${window.location.origin}/modals/modal.html`,
            allow: null,
            allowApi: true,
            position: "center",
          },
          () => {
            WA.player.state.saveVariable("ftue", true, {
              public: false,
              scope: "world",
              persist: true,
            });
          }
        );
      }

      // WA.chat.sendChatMessage(
      //   `${WA.player.name} a rejoint le monde de FlopStory !`
      // );

      // if (!currentActionMessage) {
      //   currentActionMessage = WA.ui.displayActionMessage({
      //     message: "Bienvenue dans le monde de FlopStory !",
      //     callback: () => {},
      //   });

      //   setTimeout(() => {
      //     currentActionMessage?.remove();
      //   }, 1500);
      // }
    });

    WA.room.area.onEnter("clock").subscribe(() => {
      const today = new Date();
      const time = today.getHours() + ":" + today.getMinutes();
      currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    });

    WA.room.area.onLeave("clock").subscribe(closePopup);

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra()
      .then(() => {
        console.log("Scripting API Extra ready");
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
