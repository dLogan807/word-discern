import "@mantine/core/styles.css";
import {
  Button,
  Group,
  MantineProvider,
  TextInput,
  Text,
  Stack,
  List,
  ListItem,
} from "@mantine/core";
import { useField } from "@mantine/form";
import { theme } from "./theme";
import GuessItem from "./components/GuessItem";
import { Guess } from "./classes/guess";
import { createContext, useState } from "react";
import { getDefaultWordSets } from "./utils/wordLoader";

export const GuessContext = createContext<{
  removeGuess: (guess: Guess) => void;
  updateGuess: (guess: Guess) => void;
}>({
  removeGuess: () => {},
  updateGuess: () => {},
});

export default function App() {
  const [results, setResults] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<Guess[]>([]);

  getDefaultWordSets();

  const guessField = useField({
    initialValue: "",
  });

  function handleKeyDown(event: { key: string }) {
    if (event.key === "Enter") tryAddGuess();
  }

  function tryAddGuess() {
    const guessValue = guessField.getValue();
    const validationResponse = validateGuess(guessValue, guesses);

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
    <MantineProvider theme={theme}>
      <h1>Word Discern</h1>
      <Text>Provides possible words from what you've guessed.</Text>
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
          {guesses.map((guess, idx) => (
            <GuessItem key={idx} guess={guess} />
          ))}
        </Stack>
      </GuessContext>
      <Button disabled={guesses.length == 0}>Get Possible Words!</Button>
      <List>
        {results.map((word, idx) => (
          <ListItem key={idx}>{capitalizeFirstLetter(word)}</ListItem>
        ))}
      </List>
    </MantineProvider>
  );
}

function capitalizeFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

interface ValidationResponse {
  validated: boolean;
  message: string;
}

function validateGuess(guess: string, guesses: Guess[]): ValidationResponse {
  guess = guess.trim();
  const minLength: number = 1;
  const allowedLength: number =
    guesses.length > 0 ? guesses[0].wordString.length : -1;

  const response: ValidationResponse = {
    validated: false,
    message: "",
  };

  if (guess.length < minLength) {
    response.message = "Must be at least 1 character";
  } else if (allowedLength > 0 && guess.length != allowedLength) {
    response.message = "Must be the same length (" + allowedLength + ")";
  } else if (alreadyGuessed(guess, guesses)) {
    response.message = "Already guessed";
  } else {
    response.validated = true;
  }

  return response;
}

function alreadyGuessed(guess: string, guesses: Guess[]): boolean {
  guess = guess.toUpperCase();
  for (const aGuess of guesses) {
    if (guess === aGuess.wordString) return true;
  }

  return false;
}
