import "@mantine/core/styles.css";
import {
  AppShell,
  Burger,
  Button,
  Group,
  MantineProvider,
  Title,
} from "@mantine/core";
import { theme } from "@/theme";
import { useDisclosure } from "@mantine/hooks";
import { DEFAULT_WORDS } from "@/assets/words";
import Results from "@/components/Results/Results";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Guess } from "@/classes/guess";
import getResults from "@/utils/resultBuilder";
import {
  CustomWordsFormData,
  DEFAULT_CUSTOM_WORDS_FORM,
} from "@/components/Settings/CustomWordsForm/CustomWordsForm";
import { ParsedWordSets, parseWordsToSets } from "@/utils/wordLoading";
import Guesses from "@/components/Guesses/GuessInputList/GuessInputList";
import { ThemeSelector } from "@/components/ThemeSelector/ThemeSelector";
import Settings from "@/components/Settings/Settings";
import classes from "./App.module.css";

export const CustomWordsFormContext = createContext<
  Dispatch<SetStateAction<CustomWordsFormData>>
>(() => {});

export default function App() {
  const [navbarOpened, { toggle }] = useDisclosure();

  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [shuffleResults, setShuffleResults] = useState<boolean>(true);
  const [defaultHidden, setDefaultHidden] = useState<boolean>(true);
  const [onlyAllowWordListGuesses, setOnlyAllowWordListGuesses] =
    useState<boolean>(true);

  const [storedCustomWordsFormData, setStoredCustomWordsFormData] =
    useState<CustomWordsFormData>(DEFAULT_CUSTOM_WORDS_FORM);
  const [parsedWordSets, setParsedWordSets] = useState<ParsedWordSets>(
    parseWordsToSets(DEFAULT_WORDS, false)
  );

  useEffect(() => {
    const mergedWords: string[] = storedCustomWordsFormData.replaceDefaultWords
      ? storedCustomWordsFormData.words
      : [...DEFAULT_WORDS, ...storedCustomWordsFormData.words];

    setParsedWordSets(
      parseWordsToSets(mergedWords, storedCustomWordsFormData.allowSpecialChars)
    );
  }, [storedCustomWordsFormData]);

  useEffect(() => {
    updateResults();
  }, [shuffleResults]);

  function updateResults() {
    if (guesses.length == 0 || !guesses[0]) {
      return setResults([]);
    }

    setShowResults(true);

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
          classNames={{ header: classes.header, navbar: classes.settings }}
          padding="md"
          header={{ height: 60 }}
          navbar={{
            width: 400,
            breakpoint: "sm",
            collapsed: { mobile: !navbarOpened },
          }}
        >
          <AppShell.Header>
            <Group>
              <Burger
                opened={navbarOpened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />
              <Title order={1}>Word Discern</Title>
            </Group>

            <ThemeSelector />
          </AppShell.Header>

          <AppShell.Navbar>
            <CustomWordsFormContext value={setStoredCustomWordsFormData}>
              <Settings
                wordBadgeData={{
                  replaceDefaultWords:
                    storedCustomWordsFormData.replaceDefaultWords,
                  numDefaultWords: DEFAULT_WORDS.length,
                  numWordsParsed: parsedWordSets.wordNum,
                  numCustomFormWords: storedCustomWordsFormData.words.length,
                  failedWords: parsedWordSets.failed,
                }}
                shuffleResults={shuffleResults}
                setShuffleResults={setShuffleResults}
                defaultHidden={defaultHidden}
                setDefaultHidden={setDefaultHidden}
                setOnlyAllowWordListGuessesRef={setOnlyAllowWordListGuesses}
              />
            </CustomWordsFormContext>
          </AppShell.Navbar>

          <AppShell.Main>
            <Guesses
              guesses={guesses}
              setGuesses={setGuesses}
              wordSets={
                onlyAllowWordListGuesses ? parsedWordSets.wordSets : undefined
              }
            />
            <Button disabled={!guesses.length} onClick={updateResults}>
              Get Possible Words!
            </Button>
            {showResults && (
              <Results results={results} defaultHidden={defaultHidden} />
            )}
          </AppShell.Main>
        </AppShell>
      </MantineProvider>
    </>
  );
}
