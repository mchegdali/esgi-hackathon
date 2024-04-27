import { rootLink } from "./config";
import restoreAllControls from "./utils/restore-all-controls";

export class QuizManager {
  isModalOpen = false;

  currentModal: any;

  constructor(private waAPI: typeof WA) {}

  /**
   * Permet de ne pas rafficher la modal QUIZ s'il a deja été open
   */
  openQuiz() {
    if (!this.waAPI.player.state.loadVariable("hasOpenedQuiz")) {
      this.isModalOpen = true;

      // On marque le quiz comme ouvert pour ce joueur
      this.waAPI.player.state.saveVariable("hasOpenedQuiz", true, {
        public: false,
        persist: false,
        scope: "room",
      });

      this.waAPI.controls.disablePlayerControls(); //On bloque les mouvements des joueurs

      //On appelle la fonction pour ouvrir la modal qui se trouve dans main.ts
      WA.ui.modal.openModal(
        {
          title: "Bienvenue sur FlopStory !",
          src: `${rootLink}/modals/quiz/index.html`,
          allow: null,
          allowApi: true,
          position: "center",
        },
        () => {
          restoreAllControls();
          this.isModalOpen = false;
        }
      );
    }
  }

  closeQuiz() {
    WA.ui.modal.closeModal();
  }
}
