import "@mantine/core/styles.css";
import { Button } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { Suspense, useState } from "react";
import { Guess } from "@/classes/guess";
import GuessInputList from "@/components/Guesses/GuessInputList/GuessInputList";
import Results from "@/components/Results/Results";
import getResults, { EMPTY_RESULTS, IResults } from "@/utils/resultBuilder";
import WordListFetchFailureBadge from "./components/Badges/WordListFetchFailureBadge/WordListFetchFailureBadge";
import RootLayout from "./components/Layout/RootLayout/RootLayout";
import AppContentSkeleton from "./components/Skeletons/AppContentSkeleton/AppContentSkeleton";
import { useSettingsContext } from "./hooks/useSettingsContext";
import { useWordListContext } from "./hooks/useWordListContext";

export default function App() {
  return (
    <RootLayout>
      <Suspense fallback={<AppContentSkeleton />}>
        <AppBody />
      </Suspense>
    </RootLayout>
  );
}

function AppBody() {
  const { doAnimations, hideResults, numResultsShown, onlyHideUnknownChars, shuffleResults } =
    useSettingsContext();

  const { fetchSuccess, wordSets } = useWordListContext();

  // Word data
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [results, setResults] = useState<IResults>(EMPTY_RESULTS);

  // Result state
  const [showResults, setShowResults] = useState(false);
  const [resultsUpdateKey, setResultsUpdateKey] = useState(0);

  function handleGetPossibleWords() {
    if (guesses.length === 0 || !guesses[0]) return;

    const guessLength = guesses[0].wordString.length;
    const wordSet = wordSets.get(guessLength);
    if (wordSet === undefined) {
      setResults(EMPTY_RESULTS);
      return;
    }

    const newResults = getResults(wordSet, guesses, shuffleResults, onlyHideUnknownChars);
    setResults({
      ...newResults,
      defaultHidden: hideResults,
    });

    setResultsUpdateKey((prev) => prev + 1);
    setShowResults(true);
  }

  return (
    <>
      {fetchSuccess === false && <WordListFetchFailureBadge iconSize={16} />}
      <GuessInputList guesses={guesses} setGuesses={setGuesses} />
      <Button
        id="findWordsButton"
        variant="filled"
        onClick={handleGetPossibleWords}
        disabled={!guesses.length}
        rightSection={<IconSearch aria-labelledby="findWordsButton" />}
      >
        Find possible words
      </Button>
      {showResults && (
        <Results
          results={results}
          resultsUpdateKey={resultsUpdateKey}
          numberToShow={numResultsShown}
          doAnimations={doAnimations}
        />
      )}
    </>
  );
}
