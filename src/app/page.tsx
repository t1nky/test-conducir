import BackgroundGrid from "./_components/background-grid";
import { QuizStoreProviderWrapper } from "./_provider/quiz-store-provider-wrapper";
import { Quiz } from "./quiz";

export default function HomePage() {
  return (
    <main>
      <QuizStoreProviderWrapper>
        <Quiz />
        <div className="absolute inset-0 -z-10">
          <BackgroundGrid />
        </div>
      </QuizStoreProviderWrapper>
    </main>
  );
}
