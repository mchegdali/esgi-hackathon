/// <reference types="@workadventure/iframe-api-typings" />

interface QuizAnswer {
  name: string;
  value: string;
}

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

const form = document.getElementById("quizForm") as HTMLFormElement;
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let score = 0;
  const formData = new FormData(e.target as HTMLFormElement);

  // Tableau des réponses
  const answers = JSON.parse(
    WA.state.loadVariable("quizAnswers") as string
  ) as QuizAnswer[];

  answers.forEach(function (answer) {
    const formAnswer = formData.get(answer.name);
    if (formAnswer === answer.value) {
      score += 1;
    }
  });

  await WA.player.state.saveVariable("quizScore", score, {
    public: true,
    persist: true,
  });

  WA.ui.modal.closeModal();
});
