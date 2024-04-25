interface EnterAreaData {
  areaName: string;
  playerName: string;
}

function playerHasEnteredArea({ playerName, areaName }: EnterAreaData) {
  WA.event.broadcast('player:has-entered-area', { playerName, areaName });

  WA.event.on('player:has-entered-area').subscribe(({ data, senderId }) => {
    const { playerName, areaName } = data as EnterAreaData;

    switch (areaName) {
      case 'start':
        if (WA.player.playerId !== senderId) {
          WA.ui.banner.closeBanner();
          WA.ui.banner.openBanner({
            id: 'welcomeBanner',
            text: `${playerName} s'est connecté`,
          });
        }
        break;
      case 'flop-stories':
        const flopStoriesArea = WA.state.loadVariable('flop-stories-area');

        if (
          typeof flopStoriesArea === 'object' &&
          !!flopStoriesArea &&
          'count' in flopStoriesArea &&
          typeof flopStoriesArea.count === 'number'
        ) {
          const nbPlayerInArea = flopStoriesArea.count;
          WA.state.saveVariable('flop-stories-area', {
            ...flopStoriesArea,
            count: nbPlayerInArea + 1,
          });
        }
        break;
      default:
        break;
    }
  });
}

export default playerHasEnteredArea;
