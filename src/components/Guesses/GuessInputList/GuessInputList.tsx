import {
  Autocomplete,
  Box,
  Button,
  Flex,
  InputLabel,
  Paper,
} from "@mantine/core";
import type { KeyboardEvent } from "react";
import { createContext, useMemo, useState } from "react";
import { Guess } from "@/classes/guess";
import GuessItem from "@/components/Guesses/GuessItem/GuessItem";
import { validateGuess } from "@/utils/guessValidation";
import classes from "./GuessInputList.module.css";
import useDebounce from "@/hooks/useDebounce";

export const GuessContext = createContext<{
  removeGuess: (guess: Guess) => void;
  updateGuess: (guess: Guess) => void;
  doAnimations: boolean;
}>({
  removeGuess: () => {},
  updateGuess: () => {},
  doAnimations: true,
});

export default function GuessInputList({
  guesses,
  setGuesses,
  wordSets,
  onlyAllowWordListGuesses,
  doAnimations,
}: {
  guesses: Guess[];
  setGuesses: (value: Guess[]) => void;
  wordSets: Map<number, Set<string>>;
  onlyAllowWordListGuesses: boolean;
  doAnimations: boolean;
}) {
  const [searchDropdownOpened, setSearchDropDownOpened] = useState(false);
  const [guessValue, setGuessValue] = useState("");
  const [guessError, setGuessError] = useState<null | string>(null);
  const debouncedSearch = useDebounce(guessValue, 500);

  const searchableWords = useMemo(() => {
    if (debouncedSearch.length === 0) return [];
    setSearchDropDownOpened(true);

    const words: string[] = [];
    for (const key of wordSets.keys()) {
      if (key >= debouncedSearch.length) {
        const set = wordSets.get(key);
        if (set) {
          words.push(...set);
        }
      }
    }

    return words;
  }, [debouncedSearch, wordSets]);

  function handleSelectKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") tryAddGuess();
    if (event.key === "Escape") setSearchDropDownOpened(false);
  }

  function tryAddGuess() {
    setGuessValue(guessValue.trim());
    const wordSet = wordSets.get(guessValue.length);
    setSearchDropDownOpened(false);

    const validationResponse = validateGuess(
      guessValue,
      guesses,
      wordSet,
      onlyAllowWordListGuesses,
    );

    if (!validationResponse.validated) {
      return setGuessError(validationResponse.message);
    }

    const guess = new Guess(guessValue);
    setGuesses([...guesses, guess]);

    setGuessValue("");
    setSearchDropDownOpened(false);
  }

  function removeGuess(guessToRemove: Guess) {
    setGuesses(
      guesses.filter((g) => g.wordString !== guessToRemove.wordString),
    );
  }

  function updateGuess(updatedGuess: Guess) {
    setGuesses(
      guesses.map((g) =>
        g.wordString === updatedGuess.wordString ? updatedGuess : g,
      ),
    );
  }

  function handleGuessChanged(guess: string) {
    setGuessValue(guess);
    setSearchDropDownOpened(false);
    setGuessError(null);
  }

  return (
    <Paper>
      <Box>
        <InputLabel>Guess</InputLabel>
        <Flex classNames={{ root: classes.guess_input_container }}>
          <Autocomplete
            aria-label="Guess"
            placeholder="Enter your guess"
            onKeyDown={handleSelectKeyDown}
            value={guessValue}
            error={guessError}
            onChange={handleGuessChanged}
            data={searchableWords}
            dropdownOpened={searchDropdownOpened}
            limit={5}
          />
          <Button onClick={tryAddGuess}>Add</Button>
        </Flex>
      </Box>

      <GuessContext value={{ removeGuess, updateGuess, doAnimations }}>
        {guesses.map((guess, i) => (
          <GuessItem key={i} guess={guess} />
        ))}
      </GuessContext>
    </Paper>
  );
}
