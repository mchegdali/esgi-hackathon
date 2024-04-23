interface EnterAreaData {
  areaName: string;
  playerName: string;
}

function playerHasEnteredArea({ playerName, areaName }: EnterAreaData) {
  WA.event.broadcast("player:has-entered-area", { playerName, areaName });

  WA.event.on("player:has-entered-area").subscribe(({ data, senderId }) => {
    const { playerName, areaName } = data as EnterAreaData;

    switch (areaName) {
      case "start":
        if (WA.player.playerId !== senderId) {
          WA.ui.banner.openBanner({
            id: "welcomeBanner",
            text: `${playerName} s'est connecté`,
          });
        }
        break;
      default:
        break;
    }
  });
}
