
interface Perso {
    name: string;
    description: string;
}

// Définir les personnages célèbres pour le jeu
let personnage : Perso [] = [
    { name: "Albert Einstein", description: "JE SUIS Physicien théoricien connu pour sa théorie de la relativité." },
    { name: "Marie Curie", description: "Physicienne et chimiste pionnière dans l'étude de la radioactivité." },
    { name : "William Shakespeare",  description : " Un PNJ dans une bibliothèque ou un théâtre."},
    { name :"Napoléon Bonaparte",  description : " Un PNJ dans une zone historique ou militaire."},
    { name :"Cleopatra" , description:  "Un PNJ dans une zone égyptienne ou historique."},
    { name :"Steve Jobs",  description : "Un PNJ dans une zone technologique ou informatique."},
    { name: "Marilyn Monroe" , description : "Un PNJ dans une zone de divertissement ou de cinéma."},
    { name: "James Bond", description : "Un PNJ dans une zone secrète ou d'espionnage."},
    { name :"Charlie Chaplin" , description : "Un PNJ dans une zone de comédie ou de cinéma muet."},
];
// Sélectionner un personnage aléatoire parmi la liste
function selectRandomCharacter(): Perso {
    const randomIndex = Math.floor(Math.random() * personnage.length);
    const selectedCharacter = personnage[randomIndex];

    personnage = personnage.filter((_, index) => index !== randomIndex);
    return selectedCharacter;
}
let currentPopup: any = undefined;

// Définir la fonction pour ouvrir le popup
export async function openPopup() {
    
    const randomCharacter = selectRandomCharacter();
    WA.state.saveVariable
    
    const myWebsite = await WA.ui.website.open({
        url: "./test.html",
        position: {
            vertical: "middle",
            horizontal: "middle",
        },
        size: {
            height: "50vh",
            width: "50vw",
        },
    });
    currentPopup = WA.ui.openPopup('devinePopUp',randomCharacter.description ,[])
}

// Définir la fonction pour fermer le popup
export function closePopup() {
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}