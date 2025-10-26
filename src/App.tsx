import "@mantine/core/styles.css";
import {
  AppShell,
  Burger,
  Button,
  Group,
  MantineProvider,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import { theme } from "./theme";
import { useDisclosure } from "@mantine/hooks";
import CustomWordsAccordion from "./components/CustomWordInput/CustomWordsAccordion";
import { DEFAULT_WORDS } from "./assets/words";
import Results from "./components/Results/Results";
import { useEffect, useState } from "react";
import { Guess } from "./classes/guess";
import getResults from "./utils/resultBuilder";
import {
  CustomWordsFormData,
  DEFAULT_CUSTOM_WORDS_FORM,
} from "./components/CustomWordInput/CustomWordsForm";
import { ParsedWordSets, parseWordsToSets } from "./utils/wordLoading";
import Guesses from "./components/Guesses/Guesses";
import { ThemeSelector } from "./components/ThemeSelector/ThemeSelector";

export default function App() {
  const [navbarOpened, { toggle }] = useDisclosure();

  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [shuffleResults, setShuffleResults] = useState<boolean>(false);

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

  function updateResults() {
    if (guesses.length == 0 || !guesses[0]) {
      return setResults([]);
    }

    const guessLength = guesses[0].wordString.length;
    const wordSets = parsedWordSets.wordSets.get(guessLength);

    if (wordSets == null) {
      return setResults([]);
    }

    setResults(getResults(wordSets, guesses, shuffleResults));
  }

  return (
    <>
      <MantineProvider theme={theme} defaultColorScheme="auto">
        <AppShell
          padding="md"
          header={{ height: 60 }}
          navbar={{
            width: 300,
            breakpoint: "sm",
            collapsed: { mobile: !navbarOpened },
          }}
        >
          <AppShell.Header>
            <Group justify="space-between">
              <Burger
                opened={navbarOpened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />

              <Title>Word Discern</Title>
              <Text>Finds possible words from what you've guessed.</Text>
              <ThemeSelector />
            </Group>
          </AppShell.Header>

          <AppShell.Navbar>
            <CustomWordsAccordion
              badgeData={{
                replaceDefaultWords: customWordsFormData.replaceDefaultWords,
                numDefaultWords: DEFAULT_WORDS.length,
                numWordsParsed: parsedWordSets.wordNum,
                numCustomFormWords: customWordsFormData.words.length,
                failedWords: parsedWordSets.failed,
              }}
              setFormData={setCustomWordsFormData}
            />
            <Switch
              label="Shuffle results"
              checked={shuffleResults}
              onChange={(event) =>
                setShuffleResults(event.currentTarget.checked)
              }
            />
          </AppShell.Navbar>

          <AppShell.Main>
            <Switch label="Keyboard Mode" />

            <Guesses
              guesses={guesses}
              setGuesses={setGuesses}
              wordSets={parsedWordSets.wordSets}
            />
            <Button disabled={!guesses.length} onClick={updateResults}>
              Get Possible Words!
            </Button>
            <Results results={results} />
          </AppShell.Main>
        </AppShell>
      </MantineProvider>
    </>
  );
}
