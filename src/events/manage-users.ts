import { PLAYERS_COUNT_NEEDED, eventAreas } from '../config';

export default async function manageUsers() {
  // manage styles
  const isAdmin = WA.player.name === 'La Voix';

  if (isAdmin) {
    await Promise.all([
      WA.player.setOutlineColor(0, 0, 0),
      WA.players.configureTracking(),
    ]);
  }

  for (const { areaName, variableName, btnId, eventName } of eventAreas) {
    if (isAdmin) {
      const playerCountVariableName = `playerCount:${areaName}`;
      WA.players.onVariableChange(variableName).subscribe(({ value }) => {
        const currentPlayerCount = WA.player.state.loadVariable(
          playerCountVariableName
        ) as number;

        const newPlayerCount = !!value
          ? currentPlayerCount + 1
          : currentPlayerCount - 1;

        WA.player.state.saveVariable(playerCountVariableName, newPlayerCount, {
          public: false,
          scope: 'room',
          persist: false,
        });
      });

      WA.player.state
        .onVariableChange(playerCountVariableName)
        .subscribe((value) => {
          WA.ui.actionBar.removeButton(btnId);
          if (value === PLAYERS_COUNT_NEEDED) {
            WA.ui.actionBar.addButton({
              id: btnId,
              label: `Lancer le jeu <strong>${eventName}</strong>`,

              callback: () => {
                console.log(`start event: ${eventName}`);
              },
            });
          }
        });
    } else {
      WA.room.area.onEnter(areaName).subscribe(() => {
        WA.player.state.saveVariable(variableName, true, {
          public: true,
          scope: 'room',
          persist: false,
        });
      });

      WA.room.area.onLeave(areaName).subscribe(() => {
        WA.player.state.saveVariable(variableName, false, {
          public: true,
          scope: 'room',
          persist: false,
        });
      });
    }
  }
}
