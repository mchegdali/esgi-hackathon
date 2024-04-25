/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { openPopup , closePopup} from "./jeux";

console.log('Script started successfully');
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)
   WA.state.onVariableChange('noteText').subscribe((value)=>{
        console.log(value);
   });
    WA.room.area.onEnter('devineQui').subscribe(() => {
        openPopup();
    })

    WA.room.area.onLeave('devineQui').subscribe(() => {
        closePopup();
    })

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

export {};
