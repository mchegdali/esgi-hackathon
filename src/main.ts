/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)

    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    })

    WA.room.area.onLeave('clock').subscribe(closePopup)

    // Calculate delay for the specific time
    const targetDate = new Date('2024-04-23T17:41:00'); // Set the target date and time
    const now = new Date();
    const delay = targetDate.getTime() - now.getTime(); // Delay in milliseconds

    if (delay > 0) { // Check if the target time is in the future
        setTimeout(() => {
            console.log("frefre");
            var mySound = WA.sound.loadSound("./sounds/voix 1.mp3");
            var config = {
                volume : 0.5,
                loop : false,
                rate : 1,
                detune : 1,
                delay : 0,
                seek : 0,
                mute : false
            }
            mySound.play(config);
        }, delay);
    }

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

function closePopup(){
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

export {};
