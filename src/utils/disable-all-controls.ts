/// <reference types="@workadventure/iframe-api-typings" />

function disableAllControls() {
  WA.controls.disablePlayerControls();
  WA.controls.disablePlayerProximityMeeting();
  WA.controls.disableWebcam();
  WA.controls.disableMicrophone();
}

export default disableAllControls;
