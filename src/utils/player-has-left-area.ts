interface LeftAreaEventData {
  areaName: string;
  playerName: string;
}

function playerHasLeftArea({ playerName, areaName }: LeftAreaEventData) {
  WA.event.broadcast('player:has-left-area', { playerName, areaName });

  WA.event.on('player:has-left-area').subscribe(({ data, senderId }) => {
    const { playerName, areaName } = data as LeftAreaEventData;

    switch (areaName) {
      case 'start':
        if (WA.player.playerId !== senderId) {
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
          if (flopStoriesArea.count > 0) {
            const nbPlayerInArea = flopStoriesArea.count;
            WA.state.saveVariable('flop-stories-area', {
              ...flopStoriesArea,
              count: nbPlayerInArea - 1,
            });
          }
        }
        break;
      default:
        break;
    }
  });
}

export default playerHasLeftArea;
