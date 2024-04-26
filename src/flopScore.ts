/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully flopStory');


function gestionValidate() {
     const joueurId =  WA.player.uuid;
     let score = 0;
   
     let scoaring = new Map();
    const savedButton = document.getElementById("savedButton");
    const noteTextArea = document.getElementById("noteTextArea") as HTMLTextAreaElement; // Récupérer le texte entré dans la zone de texte
            if (noteTextArea) {
                const enteredText = noteTextArea.value.trim(); 
                console.log(enteredText);
            }
    if (savedButton) {
        savedButton.addEventListener("click", () => {
            let celebritieName = "";
            const noteTextArea = document.getElementById("noteTextArea") as HTMLTextAreaElement;
            if (noteTextArea) {
                const enteredText = noteTextArea.value.trim().toLocaleLowerCase(); // Récupérer le texte entré dans la zone de texte
                const characterName = document.getElementById("description").textContent.trim().toLocaleLowerCase();
                for(let i = 0 ; i < personnage.length ; i++) {
                    if(characterName.trim().toLocaleLowerCase() === personnage[i].description.trim().toLocaleLowerCase()) {
                        celebritieName = personnage[i].name.trim().toLocaleLowerCase();
                        if (celebritieName === enteredText) {
                            console.log("Le texte correspond au nom du personnage:","res attendue",celebritieName,"res envoyer ",noteTextArea.value.trim()) ;
                            score = score + 1 ;
                            console.log("joueur :", WA.player.name," id ",joueurId," votre score est : " , score);
                            scoaring.set(joueurId,score);
                            WA.player.state.saveVariable("noteText", scoaring);
                            console.log("score note text ",WA.player.state.loadVariable("noteText"));
                            personnage.splice(i, 1);
                            console.log("Personnage supprimé avec succès.");
                            next();
                            if (personnage.length === 0) {
                                console.log("Tous les personnages ont été supprimés. Le score final est :", score);
                                afficherScore(score);
                            }
                        } else {    
                            console.log("Le texte correspond pas au nom du personnage:","res attendue",celebritieName,"res envoyer ",noteTextArea.value.trim()) ;
                            scoaring.set(joueurId,score);
                            WA.player.state.saveVariable("noteText", scoaring)
                            console.log("joueur :", WA.player.name," id ",joueurId," votre score est : " , score);
                            console.log( scoaring.set(joueurId,score));
                            console.log("score note text ",WA.player.state.loadVariable("noteText"));
                            personnage.splice(i, 1);
                            console.log("Personnage supprimé avec succès.");
                            next();
                            if (personnage.length === 0) {
                                afficherScore(score);
                            }
                        }
                    }
                }
            }
        });
    } else {
        console.error("Le bouton n'existe pas.");
    }
    
}

// Appeler la fonction pour dynamiser le contenu du h1 lors du chargement de la page
window.onload = function() {
    WA.onInit().then(() => {

    dynamiserH1AvecDescription();
    gestionValidate();
   
});
};
