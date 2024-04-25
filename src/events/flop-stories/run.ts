/// <reference types="@workadventure/iframe-api-typings" />

import { rootLink } from '../../config';
import restoreAllControls from '../../utils/restore-all-controls';

function runFlopStoriesEvent() {
  console.log('Flop Stories event started');

  WA.ui.modal.openModal(
    {
      title: 'Bienvenue sur FlopStory !',
      src: `${rootLink}/modals/welcome/index.html`,
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
}

export default runFlopStoriesEvent;
