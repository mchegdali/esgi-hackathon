export class QuizManager {
    currentModal: any;

    constructor(private waAPI: typeof WA) {}

    openQuiz() {
        this.waAPI.ui.modal.openModal({
            title: "Quiz",
            src: 'http://localhost:5173/templates/quiz.html',
            allow: "fullscreen",
            allowApi: true,
            position: "center",
        });
    }
}