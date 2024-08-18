import { QuizStoreProviderWrapper } from "./_provider/quiz-store-provider-wrapper";
import { Quiz } from "./quiz";

export default function HomePage() {
  return (
    <main>
      <QuizStoreProviderWrapper>
        <Quiz />
      </QuizStoreProviderWrapper>
    </main>
  );
}
