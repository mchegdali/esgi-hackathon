export class QuizManager {
    isModalOpen = false;

    currentModal: any;

    constructor(private waAPI: typeof WA) {}

    openQuiz() {
        if (this.waAPI.player.state.hasOpenedQuiz) {
            console.log("Le joueur a déjà ouvert le quiz.");
            return; // Quiz a déjà été ouvert par le joueur = on ne fait rien
        }

        this.isModalOpen = true;

        // On marque le quiz comme ouvert pour ce joueur
        this.waAPI.player.state.hasOpenedQuiz = true;

        this.blockMovement() //On bloque les mouvements des joueurs 
        this.waAPI.ui.modal.openModal({
            title: "Quiz",
            src: 'http://localhost:5173/templates/quiz.html',
            allow: "fullscreen",
            allowApi: true,
            position: "center",
        });
    }

    closeQuiz() {
        if (this.isModalOpen) {
            this.isModalOpen = false;
            this.unblockMovement();
            this.waAPI.ui.modal.closeModal();
        }
    }

    private blockMovement() {
        this.waAPI.controls.disablePlayerControls();
    }

    private unblockMovement() {
        this.waAPI.controls.restorePlayerControls();
    }
    
}