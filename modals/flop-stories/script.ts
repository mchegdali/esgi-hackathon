/// <reference types="@workadventure/iframe-api-typings" />

interface FlopStory {
  playerId: number;
  story: string;
}

WA.onInit().then(async () => {
  console.log("Script started successfully flopStory");
  await WA.players.configureTracking();

  const flops = JSON.parse(
    WA.state.loadVariable("flopStoriesQuestions") as string
  ) as FlopStory[];

  document.querySelectorAll("button[data-question]").forEach((button) => {
    button.addEventListener("click", (e) => {
      const currentQuestionId = parseInt(
        button.getAttribute("data-question") || "1",
        10
      );
      const currentQuestion = document.getElementById(
        "question" + currentQuestionId
      );
      const nextQuestion = document.getElementById(
        "question" + (currentQuestionId + 1)
      );
      if (nextQuestion && currentQuestion) {
        currentQuestion.classList.add("hidden");
        nextQuestion.classList.remove("hidden");
      }
    });
  });

  const formElement = document.getElementById("flopForm") as HTMLFormElement;

  formElement.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const chosenFlop = formData.get("flop");

    await WA.player.state.saveVariable("chosenFlop", chosenFlop, {
      public: true,
      persist: true,
    });

    WA.ui.modal.closeModal();
  });
});

export {};
