export class FlopStoryManager {
    isModalOpen = false;

    currentModal: any;

    private openModalFunction: (src: string, position: "left" | "right" | "center") => void;
    private closeModalFunction: () => void;


    constructor(private waAPI: typeof WA, openModalFunction: (src: string, position: "left" | "right" | "center") => void, closeModalFunction: () => void) {
        this.openModalFunction = openModalFunction;
        this.closeModalFunction = closeModalFunction;
    }

    openFlopStory() {
        // if (this.waAPI.player.state.hasOpenedFlopStory) {
        //     console.log("Le joueur a déjà ouvert flop story.");
        //     return; // Flop Story a déjà été ouvert par le joueur = on ne fait rien
        // }
        
        this.isModalOpen = true;

        // On marque flop story comme ouvert pour ce joueur
        this.waAPI.player.state.hasOpenedFlopStory = true;

        this.waAPI.controls.disablePlayerControls(); //On bloque les mouvements des joueurs 
        
        //On appelle la fonction pour ouvrir la modal qui se trouve dans main.ts
        this.openModalFunction('http://localhost:5173/templates/flop_story.html', "center");
    }

    closeFlopStory() {
        this.closeModalFunction();
    }
    
}