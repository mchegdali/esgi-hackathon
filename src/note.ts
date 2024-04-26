/// <reference types="@workadventure/iframe-api-typings" />

console.log("Script started successfully note.ts");

interface Perso {
  name: string;
  description: string;
}

// let currentIndex = 0; // Index du personnage actuellement affiché
let displayedCharacters: Perso[] = []; // Tableau pour stocker l'ordre des personnages déjà affichés

// Définir les personnages célèbres pour le jeu
let personnage: Perso[] = [
  {
    name: "Albert Einstein",
    description:
      "JE SUIS Physicien théoricien connu pour sa théorie de la relativité.",
  },
  {
    name: "Marie Curie",
    description:
      "Physicienne et chimiste pionnière dans l'étude de la radioactivité.",
  },
  {
    name: "William Shakespeare",
    description: " Un PNJ dans une bibliothèque ou un théâtre.",
  },
  {
    name: "Napoléon Bonaparte",
    description: " Un PNJ dans une zone historique ou militaire.",
  },
  {
    name: "Cleopatra",
    description: "Un PNJ dans une zone égyptienne ou historique.",
  },
  {
    name: "Steve Jobs",
    description: "Un PNJ dans une zone technologique ou informatique.",
  },
  {
    name: "Marilyn Monroe",
    description: "Un PNJ dans une zone de divertissement ou de cinéma.",
  },
  {
    name: "James Bond",
    description: "Un PNJ dans une zone secrète ou d'espionnage.",
  },
  {
    name: "Charlie Chaplin",
    description: "Un PNJ dans une zone de comédie ou de cinéma muet.",
  },
];

function selectRandomCharacter(): Perso {
  let availableCharacters = personnage.filter(
    (character) => !displayedCharacters.includes(character)
  );
  if (availableCharacters.length === 0) {
    // Tous les personnages ont déjà été affichés, réinitialiser l'ordre
    displayedCharacters = [];
    availableCharacters = personnage;
  }
  const randomIndex = Math.floor(Math.random() * availableCharacters.length);
  const selectedCharacter = availableCharacters[randomIndex];
  return selectedCharacter;
}

function next() {
  const nextPage = document.getElementById("savedButton");
  if (nextPage) {
    nextPage.addEventListener("click", () => {
      let randomCharacter;

      // Tant qu'un personnage déjà affiché est sélectionné, continuez à en choisir un nouveau
      while (true) {
        randomCharacter = selectRandomCharacter();

        // Vérifiez si le personnage sélectionné n'a pas encore été affiché
        if (!displayedCharacters.includes(randomCharacter)) {
          break; // Sortez de la boucle une fois qu'un personnage non affiché est sélectionné
        }
      }

      // Mettre à jour le contenu du h1 avec le nouveau personnage
      const descriptionElement = document.getElementById("description");
      if (descriptionElement) {
        descriptionElement.textContent = randomCharacter.description;
      }

      // Ajouter le personnage à la liste des personnages affichés
      displayedCharacters.push(randomCharacter);
    });
    console.log("Bouton next actif");
  }
}

// Fonction pour dynamiser le contenu du h1 avec la description d'un personnage aléatoire
function dynamiserH1AvecDescription() {
  const randomCharacter = selectRandomCharacter(); // Sélectionner un personnage aléatoire
  const descriptionElement = document.getElementById("description");
  if (descriptionElement) {
    descriptionElement.textContent = randomCharacter.description; // Mettre à jour le contenu du h1 avec la description du personnage
  }
}

// Fonction pour afficher le score
function afficherScore(score: number) {
  const scoreElement = document.getElementById("score");
  if (scoreElement) {
    scoreElement.textContent = score.toString();
  }

  // Affichez le bloc du score
  const scoreDisplay = document.getElementById("scoreDisplay");
  if (scoreDisplay) {
    scoreDisplay.style.display = "block";
  }
}

function gestionValidate() {
  const joueurId = WA.player.uuid;
  let score = 0;

  let scoring = new Map();
  const savedButton = document.getElementById("savedButton");
  const noteTextArea = document.getElementById(
    "noteTextArea"
  ) as HTMLTextAreaElement; // Récupérer le texte entré dans la zone de texte
  if (noteTextArea) {
    const enteredText = noteTextArea.value.trim();
    console.log(enteredText);
  }
  if (savedButton) {
    savedButton.addEventListener("click", () => {
      let celebritieName = "";
      const noteTextArea = document.getElementById(
        "noteTextArea"
      ) as HTMLTextAreaElement;
      const descriptionElement = document.getElementById(
        "description"
      ) as HTMLHeadingElement;
      if (noteTextArea) {
        const enteredText = noteTextArea.value.trim().toLocaleLowerCase(); // Récupérer le texte entré dans la zone de texte
        const characterName = descriptionElement.innerText
          .trim()
          .toLocaleLowerCase();

        for (let i = 0; i < personnage.length; i++) {
          if (
            characterName.trim().toLocaleLowerCase() ===
            personnage[i].description.trim().toLocaleLowerCase()
          ) {
            celebritieName = personnage[i].name.trim().toLocaleLowerCase();
            if (celebritieName === enteredText) {
              score = score + 1;
              scoring.set(joueurId, score);
              WA.player.state.saveVariable("noteText", scoring);
              personnage.splice(i, 1);
              next();
              if (personnage.length === 0) {
                afficherScore(score);
              }
            } else {
              scoring.set(joueurId, score);
              WA.player.state.saveVariable("noteText", scoring);
              personnage.splice(i, 1);
              next();
              if (personnage.length === 0) {
                afficherScore(score);
              }
            }
          }
        }
      }
    });
  } else {
    console.error("Le bouton n'existe pas.");
  }
}

// Appeler la fonction pour dynamiser le contenu du h1 lors du chargement de la page
window.onload = function () {
  WA.onInit().then(() => {
    dynamiserH1AvecDescription();
    gestionValidate();
  });
};

export {};
