/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { closeModal } from "./main";



console.log('Script started successfully flopStory');
await WA.players.configureTracking();
const players = WA.players.list();
for (const player of players) {
    console.log(`Player ${player.name} score is ${player.state.vote}`);
}
 function submitFlopStory() {
    let vote= new Map();
    const tabScore = [];
    let joueur = WA.player.uuid;
    console.log(joueur);
    const form = document.getElementById('flopForm');
    if(form) {
        form.addEventListener("submit",async (e)=> {
            e.preventDefault();
            const fd = new FormData(e.target as HTMLFormElement);
            const flop = fd.get('flop');
            tabScore.push(flop)
            console.log("res",flop)
            vote.set(joueur,vote );
            await WA.player.state.saveVariable("flop-stories-questions",vote)
            console.log("variable workadventure",WA.player.state.loadVariable("flop-stories-questions"));
            console.log("all player :",WA.players.list());
            const players = WA.players.list();
            
            WA.ui.modal.closeModal();
            
           
        })
    }
   else {
    console.log("veuillez envoyer votre formulaire");
    return 0;
   }
}

function gestionScore() {
    let score = new Map();
    let joueur = WA.player.uuid;
    // Obtenir le choix de l'utilisateur depuis la fonction submitFlopStory
    const selectedFlop = submitFlopStory();
    console.log(selectedFlop);
    // Vérifier si un choix a été fait
    if (selectedFlop) {
        // Mettre à jour le score du joueur
        score.set("joueur", selectedFlop);
        console.log("Le vote est :", score.get("joueur") , "de" , joueur );
        
    } else {
        console.log("Aucun choix n'a été fait.");
    }
}

// Appeler la fonction pour dynamiser le contenu du h1 lors du chargement de la page
window.onload = function() {
    WA.onInit().then(() => {
        submitFlopStory();
        gestionScore();
    });
    
};

