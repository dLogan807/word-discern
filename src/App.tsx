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
  Title,
  Switch,
  Collapse,
  Box,
} from "@mantine/core";
import { useField } from "@mantine/form";
import { theme } from "./theme";
import GuessItem from "./components/GuessItem";
import { Guess } from "./classes/guess";
import { createContext, useMemo, useState } from "react";
import { defaultWords } from "./assets/words";
import { parseWordsToSets } from "./utils/wordLoading";
import { validateGuess } from "./utils/guessValidation";
import CustomWordsInput from "./components/CustomWordsInput";
import { useDisclosure } from "@mantine/hooks";
import { IconBook, IconBook2 } from "@tabler/icons-react";

export const GuessContext = createContext<{
  removeGuess: (guess: Guess) => void;
  updateGuess: (guess: Guess) => void;
}>({
  removeGuess: () => {},
  updateGuess: () => {},
});

export const CustomWordsContext = createContext<{
  updateCustomWords: (words: string[], specialCharsAllowed: boolean) => void;
}>({
  updateCustomWords: () => {},
});

export default function App() {
  const [results, setResults] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<Guess[]>([]);

  const [customWordSets, setCustomWordSets] =
    useState<Map<number, Set<string>>>();

  const wordSets: Map<number, Set<string>> = useMemo(
    () => parseWordsToSets(defaultWords, false),
    [defaultWords]
  );

  const [mergedWordSets, setMergedWordSets] =
    useState<Map<number, Set<string>>>();

  const guessField = useField({
    initialValue: "",
  });

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

  function updateCustomWords(words: string[], specialCharsAllowed: boolean) {
    setCustomWordSets(parseWordsToSets(words, specialCharsAllowed));
  }

  const [wordsInputOpened, changeWordsInputOpened] = useDisclosure(false);

  const bookIcon = wordsInputOpened ? <IconBook /> : <IconBook2 />;

  return (
    <MantineProvider theme={theme}>
      <Title>Word Discern</Title>
      <Text>Finds possible words from what you've guessed.</Text>
      <Box maw={400} mx="auto">
        <Group justify="center" mb={5}>
          <Button
            onClick={changeWordsInputOpened.toggle}
            rightSection={bookIcon}
          >
            Add custom words
          </Button>
        </Group>

        <Collapse in={wordsInputOpened}>
          <CustomWordsContext value={{ updateCustomWords }}>
            <CustomWordsInput />
          </CustomWordsContext>
        </Collapse>
      </Box>

      <Switch label="Keyboard Mode" />
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
      <Button disabled={!guesses.length}>Get Possible Words!</Button>
      <List>
        {results.map((word, i) => (
          <ListItem key={i}>{capitalizeFirstLetter(word)}</ListItem>
        ))}
      </List>
    </MantineProvider>
  );
}

function capitalizeFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
