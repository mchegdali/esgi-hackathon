import { rootLink } from '../config';
import disableAllControls from '../utils/disable-all-controls';
import restoreAllControls from '../utils/restore-all-controls';

/**
 * This function is called when a player enters the starting area for the first time.
 */
function onFirstTimeEnter() {
  if (!WA.player.state.loadVariable('ftue')) {
    // First Time User Experience = FTUE
    disableAllControls();

    WA.ui.modal.openModal(
      {
        title: 'Bienvenue sur FlopStory !',
        src: `${rootLink}/modals/welcome/index.html`,
        // src: `https://workadventu.re`,
        allow: null,
        allowApi: true,
        position: 'center',
      },
      () => {
        restoreAllControls();

        WA.player.state.saveVariable('ftue', true, {
          public: false,
          scope: 'world',
          persist: true,
        });
      }
    );

    WA.chat.sendChatMessage(
      `${WA.player.name} a rejoint le monde de FlopStory ! Souhaitez-lui la bienvenue !`
    );
  }
}

export default onFirstTimeEnter;
