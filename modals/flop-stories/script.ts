/// <reference types="@workadventure/iframe-api-typings" />

interface FlopStory {
  playerId: number;
  story: string;
}

WA.onInit().then(async () => {
  console.log("Script started successfully flopStory");
  await WA.players.configureTracking();

  const storyElement = document.getElementById("flop-story") as HTMLDivElement;
  const storyPreviousButtonElement = storyElement.querySelector(
    "button#previous-story"
  ) as HTMLButtonElement;
  const storyNextButtonElement = storyElement.querySelector(
    "button#next-story"
  ) as HTMLButtonElement;
  const storyTextElement = storyElement.querySelector(
    "p"
  ) as HTMLParagraphElement;
  const formElement = document.getElementById("flopForm") as HTMLFormElement;
  const formElementContainer = document.getElementById(
    "flop-form-container"
  ) as HTMLDivElement;
  const formGroupTemplate = document.getElementById(
    "flop-form-group"
  ) as HTMLTemplateElement;

  const flops = JSON.parse(
    WA.state.loadVariable("flopStoriesQuestions") as string
  ) as FlopStory[];

  for (let i = 0; i < flops.length; i++) {
    const { playerId, story } = flops[i];
    const formGroup = formGroupTemplate.content.cloneNode(true) as HTMLElement;
    const input = formGroup.querySelector("input") as HTMLInputElement;
    const label = formGroup.querySelector("label") as HTMLLabelElement;

    input.value = i.toString();
    input.id = `flop-${playerId}`;
    label.htmlFor = `flop-${playerId}`;
    label.innerText = story;

    formElementContainer.appendChild(formGroup);
  }

  storyElement.dataset.end = "false";

  storyPreviousButtonElement.classList.add("hidden");

  storyPreviousButtonElement.addEventListener("click", function () {
    storyElement.dataset.end = "false";
    storyNextButtonElement.innerText = "Histoire suivante";
    const currentQuestionIndex = parseInt(storyElement.dataset.question || "0");

    if (currentQuestionIndex === 0) {
      return;
    }

    const flop = flops[currentQuestionIndex];

    storyTextElement.innerText = flop.story;
    const newQuestionIndex = currentQuestionIndex - 1;

    if (newQuestionIndex === 0) {
      this.classList.add("hidden");
    }
    storyElement.dataset.question = newQuestionIndex.toString();
  });

  storyNextButtonElement.addEventListener("click", function () {
    storyPreviousButtonElement.classList.remove("hidden");
    const currentQuestionIndex = parseInt(storyElement.dataset.question || "0");

    if (storyElement.dataset.end === "true") {
      formElement.classList.remove("hidden");
      formElement.classList.add("grid");
      storyElement.classList.add("hidden");
      return;
    }

    const flop = flops[currentQuestionIndex];

    storyTextElement.innerText = flop.story;

    const newQuestionIndex = currentQuestionIndex + 1;
    storyElement.dataset.question = newQuestionIndex.toString();

    if (newQuestionIndex === flops.length - 1) {
      this.innerText = "Passer au vote";
      storyElement.dataset.end = "true";
    }
  });

  formElement.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const chosenFlopIndex = formData.get("flop");

    const flop = flops[parseInt(chosenFlopIndex as string)];

    await WA.player.state.saveVariable("chosenFlop", flop, {
      public: true,
      persist: true,
    });

    WA.ui.modal.closeModal();
  });
});

export {};
