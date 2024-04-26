export class QuizManager {
    isModalOpen = false;

    currentModal: any;

    private openModalFunction: (src: string, position: "left" | "right" | "center") => void;
    private closeModalFunction: () => void;


    constructor(private waAPI: typeof WA, openModalFunction: (src: string, position: "left" | "right" | "center") => void, closeModalFunction: () => void) {
        this.openModalFunction = openModalFunction;
        this.closeModalFunction = closeModalFunction;
    }

    /**
     * Permet de ne pas rafficher la modal QUIZ s'il a deja été open
     */
    openQuiz() {
        // if (this.waAPI.player.state.hasOpenedQuiz) {
        //     console.log("Le joueur a déjà ouvert le quiz.");
        //     return; // Quiz a déjà été ouvert par le joueur = on ne fait rien
        // }

        this.isModalOpen = true;

        // On marque le quiz comme ouvert pour ce joueur
        this.waAPI.player.state.hasOpenedQuiz = true;

        this.waAPI.controls.disablePlayerControls(); //On bloque les mouvements des joueurs 
        
        //On appelle la fonction pour ouvrir la modal qui se trouve dans main.ts
        this.openModalFunction('http://localhost:5173/templates/quiz.html', "center");
    }

    closeQuiz() {
        this.closeModalFunction();
    }
    
}