import { Button } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { Dispatch, SetStateAction } from "react";
import { Guess } from "@/classes/guess";
import WordListFetchFailureBadge from "@/components/Badges/WordListFetchFailureBadge/WordListFetchFailureBadge";
import { useSettingsContext } from "@/hooks/useSettingsContext";
import { useWordListContext } from "@/hooks/useWordListContext";
import getResults, { EMPTY_RESULTS, IResults } from "@/utils/resultBuilder";

type FindPossibleWordsButtonProps = {
  guesses: Guess[];
  setResults: Dispatch<SetStateAction<IResults>>;
  setResultsUpdateKey: Dispatch<SetStateAction<number>>;
};

export default function FindPossibleWordsButton({
  guesses,
  setResults,
  setResultsUpdateKey,
}: FindPossibleWordsButtonProps) {
  const { hideResults, onlyHideUnknownChars, shuffleResults } = useSettingsContext();
  const { fetchSuccess, wordSets } = useWordListContext();

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
  }

  return (
    <>
      <Button
        id="findWordsButton"
        variant="filled"
        onClick={handleGetPossibleWords}
        disabled={!guesses.length}
        rightSection={<IconSearch aria-labelledby="findWordsButton" />}
      >
        Find possible words
      </Button>
      {fetchSuccess === false && <WordListFetchFailureBadge iconSize={16} showReloadLink />}
    </>
  );
}
