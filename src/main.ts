/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { openPopup , closePopup} from "./jeux";
import onFirstTimeEnter from './events/on-first-time-enter';
import manageUsers from './events/manage-users';
import { QuizManager } from "./quizManager";
import { FlopStoryManager } from "./flopStoryManager";

console.log('Script started successfully');
WA.onInit().then(() => {
  
let currentPopup: any = undefined;
let currentModal: any = undefined;

let quizManager = new QuizManager(WA, showEventModal, closeEventModal);
let flopStoryManager = new FlopStoryManager(WA, showEventModal, closeEventModal);

const audioFiles = [
    {
        name: "bienvenu.mp3",
        htmlSrc: "http://localhost:5173/templates/bienvenu.html"
    },
    {
        name: "mission_quiz.mp3",
        htmlSrc: "http://localhost:5173/templates/mission_quiz.html"
    },
    {
        name: "regle_quiz.mp3",
        htmlSrc: "http://localhost:5173/templates/regle_quiz.html"
    },
    {
        name: "mission_devine_qui.mp3",
        htmlSrc: "http://localhost:5173/templates/mission_devine_qui.html"
    },
    {
        name: "regle_devine_qui.mp3",
        htmlSrc: "http://localhost:5173/templates/regle_devine_qui.html"
    },
    {
        name: "mission_flop_story.mp3",
        htmlSrc: "http://localhost:5173/templates/mission_flop_story.html"
    },
    {
        name: "regle_flop_story.mp3",
        htmlSrc: "http://localhost:5173/templates/regle_flop_story.html"
    }
];

// Waiting for the API to be ready
WA.onInit()
  .then(async () => {

    console.log('Scripting API ready');

    console.log('Player tags: ',WA.player.tags)

   WA.state.onVariableChange('noteText').subscribe((value)=>{
        console.log(value);
   });
    WA.room.area.onEnter('devineQui').subscribe(async () => {
        await openPopup();
    })

    WA.room.area.onLeave('devineQui').subscribe(() => {
        closePopup();
    })


    // Déclencheur pour le quiz
    WA.room.area.onEnter('quizZone').subscribe(() => {
        quizManager.openQuiz();
    });

    // Déclencheur pour fermer le quiz
    WA.room.area.onLeave('quizZone').subscribe(() => {
        //// Ferme le modal du quiz
        quizManager.closeQuiz();
    });

    // Déclencheur pour flop story
    WA.room.area.onEnter('flopStoryZone').subscribe(() => {
        flopStoryManager.openFlopStory();
    });


    // Déclencheur pour fermer flop story
    WA.room.area.onLeave('flopStoryZone').subscribe(() => {
        //// Ferme le modal de flop story
        flopStoryManager.closeFlopStory();
    });
  
    const isAdmin = WA.player.tags.includes('admin');
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

    }).catch(e => console.error(e));

    // On appelle la vérification du temps avec la date et heure cibles
    const eventDate = new Date('2024-04-25T20:45:00');
    checkTimeAndTriggerEvent(eventDate);

}).catch(e => console.error(e));


export {};

//Fonction pour écouter un audio
function playAudio(audioFile: string) {
    var sound = WA.sound.loadSound("../sounds/" + audioFile);
    var config = {
        volume : 0.5,
        loop : false,
        rate : 1,
        detune : 1,
        delay : 0,
        seek : 0,
        mute : false
    }
    sound.play(config);
}

// Fonction pour faire écouter un audio + afficher le modal associé
function triggerEvent(audioFile: string, src: string, position: "left" | "right" | "center") {
    playAudio(audioFile); 
    showEventModal(src, position); // Affiche le popup
}

// Fonction pour vérifier l'heure et déclencher l'événement
function checkTimeAndTriggerEvent(targetTime: Date) {
    const now = new Date();
    const delay = targetTime.getTime() - now.getTime();

    if (delay > 0) {
        setTimeout(() => {
            triggerEvent(audioFiles[0].name, audioFiles[0].htmlSrc, "right");
        }, delay);
    }
}

//Fonction pour afficher un modal
function showEventModal(src: string, position: "left" | "right" | "center") {
    if (currentModal !== undefined) {
        WA.ui.modal.closeModal(); // Ferme le modal précédent s'il existe
        currentModal = undefined;
    }
    currentModal = WA.ui.modal.openModal({
        title: "Titre", // Titre du modal
        src: src, // Source HTML ou URL pour le contenu du modal
        allow: "fullscreen",
        allowApi: true,
        position: position // Position du modal
    });
}

//Fonction pour fermer un modal
function closeEventModal() {
    if (currentModal !== undefined) {
        WA.ui.modal.closeModal(); // Ferme le modal précédent s'il existe
        currentModal = undefined;
        WA.controls.restorePlayerControls();
    }
}

export {};

