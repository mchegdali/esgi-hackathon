import { UIWebsite } from "@workadventure/iframe-api-typings";
import { rootLink } from "../../src/config";

console.log("Script started successfully hehe");
interface Perso {
  name: string;
  description: string;
}

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
// Sélectionner un personnage aléatoire parmi la liste
function selectRandomCharacter(): Perso {
  const randomIndex = Math.floor(Math.random() * personnage.length);
  const selectedCharacter = personnage[randomIndex];

  personnage = personnage.filter((_, index) => index !== randomIndex);
  return selectedCharacter;
}
export async function addDescription() {
  const randomCharacter = selectRandomCharacter();
  const tabjoueur = [
    WA.player.playerId,
    randomCharacter.description,
    randomCharacter.name,
  ];
  WA.player.state.saveVariable("devine", tabjoueur, {
    public: true,
    persist: true,
  });
  console.log(WA.player.state.hasVariable("devine"));
  const joueur = WA.player.state.hasVariable("noteText");
  console.log(WA.state.saveVariable("noteText", tabjoueur));

  console.log(joueur);
}

export async function openModal() {
  const randomCharacter = selectRandomCharacter();
  const tabjoueur = [
    WA.player.playerId,
    randomCharacter.description,
    randomCharacter.name,
  ];
  await WA.player.state.saveVariable("devine", tabjoueur, {
    public: true,
    persist: true,
  });

  //  console.log(tabjoueur)
  WA.ui.modal.openModal({
    src: `${rootLink}/modals/guess-who/index.html`,
    title: "Devine Qui",
    position: "center",
    allowApi: true,
    allow: null,
  });
}

export function closeModal() {
  WA.ui.modal.closeModal();
}
