import { createStore } from "zustand/vanilla";
import { createJSONStorage, persist } from "zustand/middleware";
import { type Question } from "~/data/schema";
import allQuestions from "~/data/questions.json";

const QUIZ_TIMER = 2700;
const MAX_QUESTIONS = 40;

// Function to calculate the probability
function calculateProbability(correctAnswers: number) {
  if (correctAnswers >= 4) return 0.5; // Cap at 50% chance
  if (correctAnswers === 3) return 0.67; // 67% chance
  if (correctAnswers === 2) return 0.75; // 75% chance
  return 1; // 100% chance
}

export interface QuizState {
  storeInitialized: boolean;
  questions: number[];
  currentQuestionIndex: number;
  answers: Record<
    number,
    { questionIndex: number; responseIndex: number; isCorrect: boolean }
  >;
  selectedResponse: number | null;
  isCorrect: boolean | null;
  isPaused: boolean;
  correctCount: number;
  timer: number;
  timerActive: boolean;
  questionStats: Record<number, number>;
}

export interface QuizActions {
  startQuiz: (allQuestions: Question[]) => void;
  answerQuestion: (questionIndex: number, responseIndex: number) => void;
  selectResponse: (responseIndex: number) => void;
  nextQuestion: () => void;
  togglePause: () => void;
  timerTick: () => void;
  getSerializedState: () => string;
  setSerializedState: (serializedState: string) => void;
  getQuestion: (questionIndex: number) => Question;
}

export type QuizStore = QuizState & QuizActions;

export const defaultInitState: QuizState = {
  storeInitialized: false,
  questions: [],
  currentQuestionIndex: -1,
  correctCount: 0,
  answers: {},
  selectedResponse: null,
  isCorrect: null,
  isPaused: false,
  timer: QUIZ_TIMER,
  timerActive: false,
  questionStats: {},
};

export const createQuizStore = (initState: QuizState = defaultInitState) =>
  createStore<QuizStore>()(
    persist(
      (set, get) => ({
        ...initState,
        startQuiz: (allQuestions: Question[]) => {
          const randomIndices = new Set<number>();

          const questionStatistics = get().questionStats;

          while (randomIndices.size < MAX_QUESTIONS) {
            const randomIndex = Math.floor(Math.random() * allQuestions.length);
            const correctAnswers = questionStatistics[randomIndex] ?? 0;
            const probability = calculateProbability(correctAnswers);

            if (Math.random() <= probability) {
              randomIndices.add(randomIndex);
            }
          }

          set({
            questions: Array.from(randomIndices),
            currentQuestionIndex: 0,
            correctCount: 0,
            answers: {},
            selectedResponse: null,
            isCorrect: null,
            isPaused: false,
            timer: QUIZ_TIMER,
            timerActive: true,
          });
        },
        selectResponse: (responseIndex: number) =>
          set(() => ({
            selectedResponse: responseIndex,
          })),
        answerQuestion: (questionIndex: number, responseIndex: number) => {
          const questionId = get().questions[questionIndex]!;
          const question = allQuestions.questions[questionId]!;
          const isAnswerCorrect = !!question.responses[responseIndex]!.correct;
          set((state) => ({
            answers: {
              ...state.answers,
              [questionIndex]: {
                questionIndex: questionId,
                responseIndex,
                isCorrect: isAnswerCorrect,
              },
            },
            selectedResponse: responseIndex,
            isCorrect: isAnswerCorrect,
            correctCount: isAnswerCorrect
              ? state.correctCount + 1
              : state.correctCount,
            timerActive: false,
          }));
        },
        getQuestion: (questionIndex: number) =>
          allQuestions.questions[get().questions[questionIndex]!]!,
        nextQuestion: () => {
          if (get().currentQuestionIndex < get().questions.length - 1) {
            set((state) => ({
              currentQuestionIndex: state.currentQuestionIndex + 1,
              selectedResponse: null,
              isCorrect: null,
              isPaused: false,
              timerActive: true,
            }));
          } else {
            const questionStatistics = { ...get().questionStats };

            Object.values(get().answers).forEach((answerData) => {
              if (answerData.isCorrect) {
                questionStatistics[answerData.questionIndex] =
                  (questionStatistics[answerData.questionIndex] ?? 0) + 1;
              }
            });

            set(() => ({
              timerActive: false,
              selectedResponse: null,
              questionStats: questionStatistics,
            }));
          }
        },
        togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
        timerTick: () =>
          set((state) => ({
            timer: state.timer - 1,
          })),
        getSerializedState: () => JSON.stringify(get()),

        setSerializedState: (serializedState: string) => {
          const state = JSON.parse(serializedState) as QuizState;
          set(() => ({ ...state }));
        },
      }),
      {
        name: "quiz-storage", // name of the item in local storage
        storage: createJSONStorage(() => localStorage), // use local storage
      },
    ),
  );
