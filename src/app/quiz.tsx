"use client";

import { useState, useEffect } from "react";
import {
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
  PauseIcon,
  PlayIcon,
  ShareIcon,
} from "@heroicons/react/24/solid";
import { useQuizStore } from "./_provider/quiz-store-provider";
import allQuestions from "~/data/questions.json";
import { cn } from "~/util/cn";
import Image from "next/image";
import ShareState from "./_components/share";
import { useSearchParams } from "next/navigation";

function ResponseIcon({
  isCorrect,
  className,
}: {
  isCorrect: boolean | null;
  className?: string;
}) {
  if (isCorrect === null) {
    return null;
  }

  return isCorrect ? (
    <CheckIcon className={cn("h-6 w-6 text-green-500", className)} />
  ) : (
    <XMarkIcon className={cn("h-6 w-6 text-red-500", className)} />
  );
}

export const Quiz = () => {
  const {
    questions,
    currentQuestionIndex,
    answerQuestion,
    nextQuestion,
    correctCount,
    isCorrect,
    timer,
    isPaused,
    togglePause,
    selectedResponse,
    selectResponse,
    answers,
    timerActive,
    timerTick,
    getQuestion,
    startQuiz,
    storeInitialized,
  } = useQuizStore((state) => state);

  const [imageZoomed, setImageZoomed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isPaused && timerActive) {
      const interval = setInterval(() => {
        timerTick();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPaused, timerActive]);

  const handleResponse = () => {
    if (selectedResponse !== null) {
      answerQuestion(currentQuestionIndex, selectedResponse);
    }
  };

  const handleNext = () => {
    if (isCorrect != null) {
      nextQuestion();
    }
  };

  const currentQuestion =
    currentQuestionIndex >= 0 ? getQuestion(currentQuestionIndex) : null;
  const responded = isCorrect != null;
  const initialized = questions.length > 0 && currentQuestionIndex >= 0;

  if (!storeInitialized || searchParams.get("state")) return null;

  if (
    initialized &&
    Object.keys(answers).length >= questions.length &&
    selectedResponse === null
  ) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 p-6 text-center">
        <h1 className="text-4xl font-bold">¡Quiz Completo!</h1>
        <p className="text-2xl">
          Respuestas Correctas: {correctCount} / {questions.length}
        </p>
        <button
          className="mt-8 rounded bg-green-500 px-4 py-2 text-white"
          onClick={() => startQuiz(allQuestions.questions)}
        >
          Reiniciar Quiz
        </button>
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Tus respuestas:</h2>
          <div className="mt-4 space-y-4">
            {Object.entries(answers).map(([key, value], index) => {
              const questionIndex = questions[Number(key)]!;
              const question = getQuestion(questionIndex);
              const userAnswer = question.responses[value.responseIndex]!.text;
              const correctAnswer = question.responses.find(
                (r) => r.correct,
              )!.text;

              return (
                <div key={key} className="text-left">
                  <p className="font-medium">
                    {index + 1}. {question.text}
                  </p>
                  <span
                    className={cn(
                      !value.isCorrect ? "text-red-500" : "text-green-700",
                    )}
                  >
                    {userAnswer}
                  </span>
                  {!value.isCorrect && (
                    <p>
                      <span className="font-semibold">Respuesta Correcta:</span>{" "}
                      {correctAnswer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (!initialized) {
    console.log("not initialized", currentQuestionIndex, questions.length);
    return (
      <div className="flex h-svh w-full items-center justify-center">
        <button
          className="relative h-8 overflow-hidden rounded-full border border-green-700 bg-white px-2 text-green-700 shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-green-700 before:transition-all before:duration-500 hover:border-green-700 hover:text-white hover:shadow-green-700 hover:before:left-0 hover:before:w-full"
          onClick={() => startQuiz(allQuestions.questions)}
        >
          <span className="relative z-10">Iniciar Quiz </span>
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
      {isOpen && <ShareState isOpen={isOpen} setIsOpen={setIsOpen} />}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center gap-3">
          <button
            className="relative flex size-8 items-center justify-center overflow-hidden rounded-full border border-gray-500 bg-white text-gray-500 shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-red-400 before:transition-all before:duration-500 hover:border-red-400 hover:text-white hover:shadow-red-400 hover:before:left-0 hover:before:w-full"
            onClick={() => startQuiz(allQuestions.questions)}
          >
            <span className="relative z-10">
              <ArrowPathIcon className="h-4 w-4" />
            </span>
          </button>
          <span>
            {currentQuestionIndex + 1} / {questions.length}
          </span>
        </div>
        <div className="flex flex-1 items-center justify-center bg-[radial-gradient(circle,var(--tw-gradient-stops))] from-neutral-600/90 to-transparent">
          <Image src="/logo.webp" alt="Logo" width={40} height={40} />
        </div>
        <div className="flex flex-1 items-center justify-end gap-3">
          <span
            className={cn(
              timer <= 0
                ? "text-red-500"
                : timer <= 300
                  ? "text-orange-500"
                  : "text-black",
            )}
          >
            {isPaused
              ? "Pausado"
              : `${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, "0")}`}
          </span>
          <button
            className="relative flex size-8 items-center justify-center overflow-hidden rounded-full border border-gray-500 bg-white px-2 text-gray-500 shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-blue-400 before:transition-all before:duration-500 hover:border-blue-400 hover:text-white hover:shadow-blue-400 hover:before:left-0 hover:before:w-full"
            onClick={togglePause}
          >
            <span className="relative z-10">
              {isPaused ? (
                <PlayIcon className="h-4 w-4" />
              ) : (
                <PauseIcon className="h-4 w-4" />
              )}
            </span>
          </button>
          <button
            className="relative flex size-8 items-center justify-center overflow-hidden rounded-full border border-gray-500 bg-white px-2 text-gray-500 shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-indigo-500 before:transition-all before:duration-500 hover:border-indigo-500 hover:text-white hover:shadow-indigo-500 hover:before:left-0 hover:before:w-full"
            onClick={() => setIsOpen(true)}
          >
            <ShareIcon className="relative z-10 h-4 w-4" />
          </button>
        </div>
      </div>
      {!isPaused && currentQuestion && (
        <div className="flex flex-col items-center gap-5">
          <div className="flex flex-col gap-4">
            <div className="text-center text-lg">{currentQuestion.text}</div>
            {currentQuestion.img && (
              <img
                src={currentQuestion.img}
                alt={currentQuestion.text}
                className={cn(
                  "mx-auto max-h-96 w-3/4 rounded-lg object-contain transition-all duration-200",
                  imageZoomed && "z-10 w-full scale-105",
                )}
                onClick={() => setImageZoomed((imageZoomed) => !imageZoomed)}
              />
            )}
            <div className="h-8">
              {isCorrect != null && (
                <div
                  className={cn(
                    "mx-auto flex h-8 w-8 items-center justify-center rounded-full border text-center",
                    isCorrect ? "bg-green-500" : "bg-red-500",
                  )}
                >
                  <ResponseIcon isCorrect={isCorrect} className="text-white" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {currentQuestion.responses.map((response, index) => {
                const isCorrect = !!response.correct;
                const isSelected = selectedResponse === index;

                return (
                  <button
                    key={index}
                    className={cn(
                      "relative w-full select-text border border-transparent p-4 text-left transition-transform duration-200 first:rounded-t last:rounded-b",
                      {
                        // If responded and selected
                        "scale-105 bg-green-500 text-white":
                          responded && isSelected && isCorrect,
                        "scale-105 bg-red-500 text-white":
                          responded && isSelected && !isCorrect,

                        // If responded and not selected
                        "border-green-500 bg-green-100 text-green-900":
                          responded && !isSelected && isCorrect,
                        "border-red-500":
                          responded && !isSelected && !isCorrect,

                        // If not responded
                        "scale-105 border-gray-800 bg-indigo-100":
                          !responded && isSelected,
                        "bg-gray-200": !responded && !isSelected,
                      },
                    )}
                    onClick={() => {
                      if (!responded) selectResponse(index);
                    }}
                  >
                    {response.text}
                  </button>
                );
              })}
            </div>
          </div>
          {isCorrect != null && (
            <button
              className={cn(
                "h-10 max-w-72 rounded bg-gray-700 px-4 text-white",
                isCorrect == null && "cursor-not-allowed opacity-50",
              )}
              onClick={handleNext}
              disabled={isCorrect == null}
            >
              Siguiente
            </button>
          )}
          {selectedResponse != null && !responded && (
            <button
              className="h-10 max-w-72 rounded bg-gray-700 px-4 text-white"
              onClick={handleResponse}
            >
              Chequear
            </button>
          )}
        </div>
      )}
    </div>
  );
};
