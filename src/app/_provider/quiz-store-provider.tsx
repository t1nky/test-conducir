"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, createContext, useRef, useContext, useEffect } from "react";
import { useStore } from "zustand";
import lz from "lz-string";
import {
  type QuizStore,
  createQuizStore,
  defaultInitState,
} from "~/app/_store/quiz-store";

export type QuizStoreApi = ReturnType<typeof createQuizStore>;

export const QuizStoreContext = createContext<QuizStoreApi | undefined>(
  undefined,
);

export interface QuizStoreProviderProps {
  children: ReactNode;
}

export const QuizStoreProvider = ({ children }: QuizStoreProviderProps) => {
  const storeRef = useRef<QuizStoreApi>();

  const searchParams = useSearchParams();
  const router = useRouter();

  if (!storeRef.current) {
    storeRef.current = createQuizStore(defaultInitState);
    storeRef.current.setState({ storeInitialized: true });
  }

  if (searchParams.get("state") && typeof localStorage !== "undefined") {
    storeRef.current.setState(
      JSON.parse(
        lz.decompressFromEncodedURIComponent(searchParams.get("state")!),
      ),
    );
  }

  useEffect(() => {
    if (searchParams.get("state")) {
        router.replace("/", { scroll: false });
    }
  }, [searchParams.get("state")]);

  return (
    <QuizStoreContext.Provider value={storeRef.current}>
      {children}
    </QuizStoreContext.Provider>
  );
};

export const useQuizStore = <T,>(selector: (store: QuizStore) => T): T => {
  const quizStoreContext = useContext(QuizStoreContext);

  if (!quizStoreContext) {
    throw new Error(`useQuizStore must be used within QuizStoreProvider`);
  }

  return useStore(quizStoreContext, selector);
};
