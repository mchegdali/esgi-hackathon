/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { QuizManager } from "./quizManager";

console.log('Script started successfully');

let currentPopup: any = undefined;

let quizManager = new QuizManager(WA);

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)

    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    })

    // Déclencheur pour le quiz
    WA.room.area.onEnter('quizZone').subscribe(() => {
        quizManager.openQuiz();
    });

    WA.room.area.onLeave('clock').subscribe(closePopup)

    // Déclencheur pour fermer le quiz
    WA.room.area.onLeave('quizZone').subscribe(() => {
        WA.ui.modal.closeModal();  // Ferme le modal actuellement ouvert
    });


    // On spécifie la date à laquelle on va passer l'audio
    const targetDate = new Date('2024-04-23T17:41:00');
    const now = new Date();
    const delay = targetDate.getTime() - now.getTime(); //le délai qui va permettre de déclencher l'audio

    if (delay > 0) {
        setTimeout(() => {
            var mySound = WA.sound.loadSound("../sounds/voix 1.mp3");
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