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
import {
  IconAdjustments,
  IconBook,
  IconBook2,
  IconCheck,
  IconCopyOff,
  IconList,
  IconX,
} from "@tabler/icons-react";
import { DEFAULT_CUSTOM_WORDS_FORM } from "./components/CustomWordsForm";
import getResults from "./utils/resultBuilder";

export const GuessContext = createContext<{
  removeGuess: (guess: Guess) => void;
  updateGuess: (guess: Guess) => void;
}>({
  removeGuess: () => {},
  updateGuess: () => {},
});

export default function App() {
  const [customWordsFormData, setCustomWordsFormData] =
    useState<CustomWordsFormData>(DEFAULT_CUSTOM_WORDS_FORM);
  const [parsedWordSets, setParsedWordSets] = useState<ParsedWordSets>(
    parseWordsToSets(DEFAULT_WORDS, false)
  );
  useEffect(() => {
    const mergedWords: string[] = customWordsFormData.replaceDefaultWords
      ? customWordsFormData.words
      : [...DEFAULT_WORDS, ...customWordsFormData.words];

    setParsedWordSets(
      parseWordsToSets(mergedWords, customWordsFormData.allowSpecialChars)
    );
  }, [customWordsFormData]);

  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [results, setResults] = useState<string[]>([]);

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

  function updateResults() {
    if (guesses.length == 0 || !guesses[0]) {
      return setResults([]);
    }

    const guessLength = guesses[0].wordString.length;
    const wordSets = parsedWordSets.wordSets.get(guessLength);

    if (wordSets == null) {
      return setResults([]);
    }

    setResults(getResults(wordSets, guesses));
  }

  const [wordsInputOpened, changeWordsInputOpened] = useDisclosure(false);
  const bookIcon = wordsInputOpened ? <IconBook /> : <IconBook2 />;

  function LoadedWordsBadges() {
    const customWordsInUse: number = customWordsFormData.replaceDefaultWords
      ? parsedWordSets.wordNum
      : parsedWordSets.wordNum - DEFAULT_WORDS.length;

    const validCustomWords: number =
      customWordsFormData.words.length - parsedWordSets.failed.length;

    const wordsAlreadyExisting: number = validCustomWords - customWordsInUse;

    const customWordsText =
      customWordsFormData.words.length == 0 || validCustomWords == 0
        ? "No custom words loaded"
        : `${validCustomWords} valid custom words parsed`;

    const iconSize = 16;

    return (
      <Group>
        <Badge leftSection={<IconList size={iconSize} />} variant="light">
          {parsedWordSets.wordNum} total words
        </Badge>
        <Badge
          leftSection={<IconAdjustments size={iconSize} />}
          variant="light"
          color="yellow"
        >
          {customWordsText}
        </Badge>
        {wordsAlreadyExisting && (
          <Badge
            leftSection={<IconCopyOff size={iconSize} />}
            variant="light"
            color="yellow"
          >
            {wordsAlreadyExisting} already existed in word list
          </Badge>
        )}
        {customWordsInUse && (
          <Badge
            leftSection={<IconCheck size={iconSize} />}
            variant="light"
            color="green"
          >
            {customWordsInUse} added to word list
          </Badge>
        )}
        {parsedWordSets.failed.length && (
          <Badge
            leftSection={<IconX size={iconSize} />}
            variant="light"
            color="red"
          >
            {parsedWordSets.failed.length} Invalid words
          </Badge>
        )}
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
      <Button disabled={!guesses.length} onClick={updateResults}>
        Get Possible Words!
      </Button>
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
