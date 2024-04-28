/// <reference types="@workadventure/iframe-api-typings" />
import Fuse from "fuse.js";

export interface Character {
  name: string;
  description: string;
}

const allCharacters: Character[] = [];

let characters: Character[];

const fuse = new Fuse(allCharacters, {
  keys: ["name"],
  threshold: 0.2,
  includeScore: true,
});

let currentCharacter: Character | null = null;
let currentScore = 0;

function selectRandomCharacter() {
  if (characters.length > 0) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    currentCharacter = characters.splice(randomIndex, 1)[0];

    updateTitle(currentCharacter);
  }
}

async function next() {
  if (characters.length > 0) {
    selectRandomCharacter();
  } else {
    await WA.player.state.saveVariable("guessWhoScore", currentScore, {
      public: true,
      persist: true,
    });

    WA.ui.modal.closeModal();
  }
}

function updateTitle(character: Character) {
  if (descriptionLabelElement) {
    descriptionLabelElement.textContent = character.description;
  }
}

const descriptionLabelElement = document.getElementById(
  "description"
) as HTMLLabelElement;

const formElement = document.getElementById("guessForm") as HTMLFormElement;

formElement.addEventListener("submit", async function (event) {
  event.preventDefault();
  const selectedCharacter = currentCharacter!;
  const fd = new FormData(this);
  const enteredText =
    fd.get("answer")?.toString().trim().toLocaleLowerCase() ?? "";

  const celebrityName = selectedCharacter.name.trim().toLocaleLowerCase();

  const fuseResult = fuse.search(enteredText);
  const bestMatch = fuseResult[0];

  if (
    fuseResult.length > 0 &&
    typeof bestMatch.score === "number" &&
    bestMatch.score < 0.2 &&
    celebrityName === bestMatch.item.name.trim().toLocaleLowerCase()
  ) {
    currentScore++;
  }
  await next();
  this.reset();
});

function loadCharacters() {
  const charactersVar = JSON.parse(
    WA.state.loadVariable("guessWhoQuestions") as string
  ) as Character[];

  const charactersCount = charactersVar.length;

  for (let i = 0; i < charactersCount; i++) {
    allCharacters.push(charactersVar[i]);
  }

  characters = allCharacters.slice();
}

// Appeler la fonction pour dynamiser le contenu du h1 lors du chargement de la page
window.onload = function () {
  WA.onInit().then(() => {
    loadCharacters();
    selectRandomCharacter();
  });
};

export {};
