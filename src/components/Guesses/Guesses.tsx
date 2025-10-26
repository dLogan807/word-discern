import { Button, Group, Stack, TextInput } from "@mantine/core";
import { createContext } from "react";
import { Guess } from "../../classes/guess";
import GuessItem from "../GuessItem";
import { useField } from "@mantine/form";
import { validateGuess } from "../../utils/guessValidation";

export const GuessContext = createContext<{
  removeGuess: (guess: Guess) => void;
  updateGuess: (guess: Guess) => void;
}>({
  removeGuess: () => {},
  updateGuess: () => {},
});

export default function Guesses({
  guesses,
  wordSets,
  setGuesses,
}: {
  guesses: Guess[];
  wordSets: Map<number, Set<string>>;
  setGuesses: (value: Guess[]) => void;
}) {
  const guessField = useField({
    initialValue: "",
  });

  //Enter when adding a guess
  function handleKeyDown(event: { key: string }) {
    if (event.key === "Enter") tryAddGuess();
  }
  function tryAddGuess() {
    const guessValue = guessField.getValue();
    const validationResponse = validateGuess(
      guessValue,
      guesses,
      wordSets.get(guessValue.length)
    );

    if (!validationResponse.validated) {
      return guessField.setError(validationResponse.message);
    }

    const guess: Guess = new Guess(guessValue);
    setGuesses([...guesses, guess]);
    guessField.setValue("");
  }

  function removeGuess(guessToRemove: Guess) {
    setGuesses(
      guesses.filter((g) => g.wordString !== guessToRemove.wordString)
    );
  }

  function updateGuess(updatedGuess: Guess) {
    setGuesses(
      guesses.map((g) =>
        g.wordString === updatedGuess.wordString ? updatedGuess : g
      )
    );
  }

  return (
    <Stack>
      <Group>
        <TextInput
          {...guessField.getInputProps()}
          label="Guess"
          placeholder="Enter your guess"
          onKeyDown={handleKeyDown}
        />
        <Button onClick={tryAddGuess}>Add</Button>
      </Group>
      <GuessContext value={{ removeGuess, updateGuess }}>
        <Stack>
          {guesses.map((guess, i) => (
            <GuessItem key={i} guess={guess} />
          ))}
        </Stack>
      </GuessContext>
    </Stack>
  );
}
