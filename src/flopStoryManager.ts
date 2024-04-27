import { rootLink } from "./config";

export class FlopStoryManager {
  isModalOpen = false;

  currentModal: any;

  private openModalFunction: (
    src: string,
    position: "left" | "right" | "center"
  ) => void;
  private closeModalFunction: () => void;

  constructor(
    private waAPI: typeof WA,
    openModalFunction: (
      src: string,
      position: "left" | "right" | "center"
    ) => void,
    closeModalFunction: () => void
  ) {
    this.openModalFunction = openModalFunction;
    this.closeModalFunction = closeModalFunction;
  }

  openFlopStory() {
    if (!WA.player.state.hasVariable("flopStoryScore")) {
      this.waAPI.controls.disablePlayerControls(); //On bloque les mouvements des joueurs

      //On appelle la fonction pour ouvrir la modal qui se trouve dans main.ts
      this.openModalFunction(
        `${rootLink}/modals/flop-stories/index.html`,
        "center"
      );
    }
  }

  closeFlopStory() {
    if (!WA.player.state.hasVariable("flopStoryScore")) {
      WA.player.state.saveVariable("flopStoryScore", 0, {
        public: true,
        persist: true,
      });
    }
    this.closeModalFunction();
  }
}
