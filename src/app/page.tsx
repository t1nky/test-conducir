import BackgroundGrid from "./_components/background-grid";
import { Quiz } from "./quiz";

export default function HomePage() {
  return (
    <main>
      <Quiz />
      <div className="absolute inset-0 -z-10">
        <BackgroundGrid />
      </div>
    </main>
  );
}
