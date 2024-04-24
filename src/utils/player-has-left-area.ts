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
      default:
        break;
    }
  });
}
