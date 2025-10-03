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
  Badge,
} from "@mantine/core";
import { useField } from "@mantine/form";
import { theme } from "./theme";
import GuessItem from "./components/GuessItem";
import { Guess } from "./classes/guess";
import { createContext, useEffect, useState } from "react";
import { DEFAULT_WORDS } from "./assets/words";
import { ParsedWordSets, parseWordsToSets } from "./utils/wordLoading";
import { validateGuess } from "./utils/guessValidation";
import WordInputForm, {
  CustomWordsFormData,
} from "./components/CustomWordsForm";
import { useDisclosure } from "@mantine/hooks";
import { IconBook, IconBook2 } from "@tabler/icons-react";
import { DEFAULT_CUSTOM_WORDS_FORM } from "./components/CustomWordsForm";

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

  const [customWordsFormData, setCustomWordsFormData] =
    useState<CustomWordsFormData>(DEFAULT_CUSTOM_WORDS_FORM);

  useEffect(() => {
    const mergedWords: string[] = customWordsFormData.replaceDefaultWords
      ? customWordsFormData.words
      : [...DEFAULT_WORDS, ...customWordsFormData.words];

    setParsedWordSets(
      parseWordsToSets(mergedWords, customWordsFormData.allowSpecialChars)
    );
  }, [customWordsFormData]);

  const [parsedWordSets, setParsedWordSets] = useState<ParsedWordSets>(
    parseWordsToSets(DEFAULT_WORDS, false)
  );

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
      parsedWordSets.wordSets.get(guessValue.length)
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

  const [wordsInputOpened, changeWordsInputOpened] = useDisclosure(false);

  const bookIcon = wordsInputOpened ? <IconBook /> : <IconBook2 />;

  function LoadedWordsBadges() {
    const customWordNum: number = customWordsFormData.replaceDefaultWords
      ? parsedWordSets.succeeded.length
      : Math.abs(DEFAULT_WORDS.length - parsedWordSets.succeeded.length);

    return (
      <Group>
        <Badge variant="light">
          {parsedWordSets.succeeded.length} total words
        </Badge>
        <Badge variant="light" color="yellow">
          {customWordNum} custom
        </Badge>
        <Badge variant="light" color="red">
          {parsedWordSets.failed.length} failed to load
        </Badge>
      </Group>
    );
  }

  return (
    <MantineProvider theme={theme}>
      <Title>Word Discern</Title>
      <Text>Finds possible words from what you've guessed.</Text>

      <Box maw={400} mx="auto">
        <Group mb={10}>
          <Button
            onClick={changeWordsInputOpened.toggle}
            rightSection={bookIcon}
          >
            Add custom words
          </Button>
        </Group>

        <Collapse in={wordsInputOpened}>
          <Stack>
            <LoadedWordsBadges />
            <WordInputForm updateCustomWords={setCustomWordsFormData} />
          </Stack>
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
