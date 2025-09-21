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
import { createContext, useContext, useState } from "react";

export const GuessContext = createContext<(guess: Guess) => void>(() => {});

export default function App() {
  const [results, setResults] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<Guess[]>([]);

  const guessField = useField({
    initialValue: "",
  });

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === "Enter") {
      tryAddGuess();
    }
  };

  function tryAddGuess() {
    const guessValue = guessField.getValue();
    const validationResponse = validateGuess(guessValue, guesses);

    if (!validationResponse.validated) {
      guessField.setError(validationResponse.message);
      return;
    }

    const guess: Guess = new Guess(guessValue);
    setGuesses([...guesses, guess]);
    guessField.setValue("");
  }

  return (
    <MantineProvider theme={theme}>
      <h1>Wordle Helper</h1>
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
      <GuessContext value={(guess: Guess) => removeGuess(guess)}>
        <Stack>
          {guesses.map((guess, idx) => (
            <GuessItem key={idx} guess={guess} />
          ))}
        </Stack>
      </GuessContext>
      <Button disabled={guesses.length == 0}>Get Possible Words!</Button>
      <List>
        {results.map((word, idx) => (
          <ListItem key={idx} className="result_item">
            {capitalizeFirstLetter(word)}
          </ListItem>
        ))}
      </List>
    </MantineProvider>
  );

  //Set array to one not containing guess
  function removeGuess(guess: Guess) {
    setGuesses(guesses.filter((g) => g.wordString !== guess.wordString));
  }
}

function capitalizeFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

interface validationResponse {
  validated: boolean;
  message: string;
}

function validateGuess(guess: string, guesses: Guess[]): validationResponse {
  guess = guess.trim();
  const minLength: number = 1;
  const allowedLength: number =
    guesses.length > 0 ? guesses[0].wordString.length : -1;

  const response: validationResponse = {
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
