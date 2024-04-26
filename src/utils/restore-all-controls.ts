/// <reference types="@workadventure/iframe-api-typings" />

function restoreAllControls() {
  WA.controls.restorePlayerControls();
  WA.controls.restorePlayerProximityMeeting();
  WA.controls.restoreWebcam();
  WA.controls.restoreMicrophone();
}

export default restoreAllControls;
