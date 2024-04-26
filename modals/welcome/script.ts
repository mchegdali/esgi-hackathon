/// <reference types="@workadventure/iframe-api-typings" />

const titleEl = document.getElementById('title');
const descriptionEl = document.getElementById('description');
const nextBtnEl = document.getElementById('nextBtn');
const previousBtnEl = document.getElementById('previousBtn');

if (titleEl && descriptionEl && nextBtnEl && previousBtnEl) {
  let currentStep = 0;

  const steps = [
    {
      title: 'Bienvenue sur FlopStory !',
      content:
        'Dans FlopStory, vous et vos collègues vous affronterez au cours de plusieurs épreuves qui vous permettront de remporter des points. Le candidat récoltant le plus de points sera désigné le TopFlopper !',
      nextButtonLabel: 'Les épreuves',
    },
    {
      title: 'Les épreuves',
      content: `
            Au cours de la partie, vous serez confronté à plusieurs épreuves.
            Chaque épreuve vous permettra de remporter des points.
            
            Les épreuves sont variées et peuvent être de différents types :
            - Quiz
            - Devine qui?
            - Flop Stories
            `,
      nextButtonLabel: 'Les points',
    },
    {
      title: 'Les points',
      content: "A l'issue de chaque épreuve, des points vous seront attribués.",
      nextButtonLabel: 'Le TopFlopper',
    },
    {
      title: 'Le TopFlopper',
      content:
        'Le TopFlopper est le candidat ayant récolté le plus de points à la fin de la partie. Il sera désigné comme le grand gagnant.',
      nextButtonLabel: 'Terminer',
    },
  ];

  function updateModalContent(currentStep = 0) {
    if (!(titleEl && descriptionEl && nextBtnEl && previousBtnEl)) {
      return;
    }
    if (currentStep === 0) {
      previousBtnEl.classList.add('hidden');
    } else {
      previousBtnEl.classList.remove('hidden');
    }
    if (currentStep >= 0 && currentStep < steps.length) {
      const { title, content, nextButtonLabel } = steps[currentStep];
      titleEl.innerText = title;
      descriptionEl.innerText = content;
      nextBtnEl.innerText = nextButtonLabel;
    }
  }

  function manageButtonsVisibility(currentStep = 0) {
    if (!(nextBtnEl && previousBtnEl)) return;

    if (currentStep === 0) {
      previousBtnEl.classList.add('hidden');
    } else {
      previousBtnEl.classList.remove('hidden');
    }

    if (currentStep === steps.length - 1) {
      nextBtnEl.classList.add('hidden');
    } else {
      nextBtnEl.classList.remove('hidden');
    }
  }

  manageButtonsVisibility(currentStep);
  updateModalContent(currentStep);

  nextBtnEl.addEventListener('click', () => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      updateModalContent(currentStep);
    }

    manageButtonsVisibility(currentStep);
  });

  previousBtnEl.addEventListener('click', () => {
    if (currentStep > 0) {
      currentStep--;
      updateModalContent(currentStep);
    }

    manageButtonsVisibility(currentStep);
  });
}
