import "@mantine/core/styles.css";
import { Suspense, useState } from "react";
import { Guess } from "@/classes/guess";
import GuessInputList from "@/components/Guesses/GuessInputList/GuessInputList";
import Results from "@/components/Results/Results";
import { EMPTY_RESULTS, IResults } from "@/utils/resultBuilder";
import FindPossibleWordsButton from "./components/Buttons/FindPossibleWordsButton/FindPossibleWordsButton";
import RootLayout from "./components/Layout/RootLayout/RootLayout";
import FindPossibleWordsButtonSkeleton from "./components/Skeletons/FindPossibleWordsButtonSkeleton/FindPossibleWordsButtonSkeleton";
import { useSettingsContext } from "./hooks/useSettingsContext";

export default function App() {
  const { doAnimations, numResultsShown } = useSettingsContext();

  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [results, setResults] = useState<IResults>(EMPTY_RESULTS);
  const [resultsUpdateKey, setResultsUpdateKey] = useState(0);

  return (
    <RootLayout>
      <GuessInputList guesses={guesses} setGuesses={setGuesses} />
      <Suspense fallback={<FindPossibleWordsButtonSkeleton />}>
        <FindPossibleWordsButton
          guesses={guesses}
          setResults={setResults}
          setResultsUpdateKey={setResultsUpdateKey}
        />
      </Suspense>
      {resultsUpdateKey > 0 && (
        <Results
          results={results}
          resultsUpdateKey={resultsUpdateKey}
          numberToShow={numResultsShown}
          doAnimations={doAnimations}
        />
      )}
    </RootLayout>
  );
}
