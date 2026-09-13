import "@mantine/core/styles.css";
import { Button } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { Guess } from "@/classes/guess";
import GuessInputList from "@/components/Guesses/GuessInputList/GuessInputList";
import Results from "@/components/Results/Results";
import getResults, { EMPTY_RESULTS, IResults } from "@/utils/resultBuilder";
import RootLayout from "./components/Layout/RootLayout/RootLayout";
import { useSettingsContext } from "./hooks/useSettingsContext";
import { useWordListContext } from "./hooks/useWordListContext";

export default function App() {
  const { doAnimations, hideResults, numResultsShown, onlyHideUnknownChars, shuffleResults } =
    useSettingsContext();

  const { wordSets } = useWordListContext();

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
    <RootLayout>
      <GuessInputList guesses={guesses} setGuesses={setGuesses} />
      <Button
        variant="filled"
        onClick={handleGetPossibleWords}
        disabled={!guesses.length}
        rightSection={<IconSearch />}
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
    </RootLayout>
  );
}
