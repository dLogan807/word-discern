import { Box, Button, Flex, InputLabel, Paper, Select } from "@mantine/core";
import { createContext, useMemo, useState } from "react";
import { Guess } from "@/classes/guess";
import GuessItem from "@/components/Guesses/GuessItem/GuessItem";
import { useField } from "@mantine/form";
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
  const guessField = useField({
    mode: "controlled",
    initialValue: "",
  });
  const [searchDropdownOpened, setSearchDropDownOpened] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);

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

  function handleEnterKeyDown(event: { key: string }) {
    if (event.key === "Enter") tryAddGuess();
  }

  function tryAddGuess() {
    const wordSet = wordSets.get(searchValue.length);
    setSearchDropDownOpened(false);

    const validationResponse = validateGuess(
      searchValue,
      guesses,
      wordSet,
      onlyAllowWordListGuesses,
    );

    if (!validationResponse.validated) {
      return guessField.setError(validationResponse.message);
    }

    const guess = new Guess(searchValue);
    setGuesses([...guesses, guess]);

    setSearchValue("");
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
    setSearchValue(guess);
    setSearchDropDownOpened(false);
    guessField.setError(null);
  }

  return (
    <Paper>
      <Box>
        <InputLabel>Guess</InputLabel>
        <Flex classNames={{ root: classes.guess_input_container }}>
          <Select
            {...guessField.getInputProps()}
            aria-label="Guess"
            placeholder="Enter your guess"
            onKeyDown={handleEnterKeyDown}
            searchValue={searchValue}
            onSearchChange={handleGuessChanged}
            data={searchableWords}
            dropdownOpened={searchDropdownOpened}
            nothingFoundMessage={
              searchValue.length > 1 ? "No words found :<" : null
            }
            limit={5}
            searchable
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
