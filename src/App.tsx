import "@mantine/core/styles.css";
import {
  AppShell,
  Burger,
  Button,
  Group,
  MantineProvider,
  ScrollArea,
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
import getResults, { IResults } from "@/utils/resultBuilder";
import {
  CustomWordsFormData,
  DEFAULT_CUSTOM_WORDS_FORM,
} from "@/components/Settings/CustomWordsForm/CustomWordsForm";
import { ParsedWordSets, parseWordsToSets } from "@/utils/wordLoading";
import GuessInputList from "@/components/Guesses/GuessInputList/GuessInputList";
import { ThemeSelector } from "@/components/ThemeSelector/ThemeSelector";
import Settings from "@/components/Settings/Settings";
import classes from "./App.module.css";

export const CustomWordsFormContext = createContext<
  Dispatch<SetStateAction<CustomWordsFormData>>
>(() => {});

export default function App() {
  const [navbarOpened, { toggle }] = useDisclosure();

  // Word data
  const blankResults: IResults = { words: [], revealedCharPositions: [] };
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [results, setResults] = useState<IResults>(blankResults);
  const [storedCustomWordsFormData, setStoredCustomWordsFormData] =
    useState<CustomWordsFormData>(DEFAULT_CUSTOM_WORDS_FORM);
  const [parsedWordSets, setParsedWordSets] = useState<ParsedWordSets>(
    parseWordsToSets(DEFAULT_WORDS, false)
  );

  // Result state
  const [showResults, setShowResults] = useState(false);
  const [resultUpdateKey, setResultUpdateKey] = useState(0);

  // Settings
  const [onlyAllowWordListGuesses, setOnlyAllowWordListGuesses] =
    useState(true);
  const [shuffleResults, setShuffleResults] = useState(true);
  const [hideResults, setHideResults] = useState(true);
  const [onlyHideUnknownChars, setOnlyHideUnknownChars] = useState(true);
  const [numResultsShown, setNumResultsShown] = useState(20);
  const [doAnimations, setDoAnimations] = useState(true);

  useEffect(() => {
    const mergedWords: string[] = storedCustomWordsFormData.replaceDefaultWords
      ? storedCustomWordsFormData.words
      : [...DEFAULT_WORDS, ...storedCustomWordsFormData.words];

    setParsedWordSets(
      parseWordsToSets(mergedWords, storedCustomWordsFormData.allowSpecialChars)
    );
  }, [storedCustomWordsFormData]);

  function handleGetPossibleWords() {
    if (guesses.length == 0 || !guesses[0]) return;

    const guessLength = guesses[0].wordString.length;
    const wordSet = parsedWordSets.wordSets.get(guessLength);

    if (wordSet == null) return;

    setResults({
      ...getResults(wordSet, guesses, shuffleResults),
      revealedCharPositions: onlyHideUnknownChars
        ? []
        : results.revealedCharPositions,
      defaultHidden: hideResults,
    });

    setResultUpdateKey((prev) => prev + 1);
    setShowResults(true);
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
              <ScrollArea type="auto">
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
                  hideResults={hideResults}
                  setHideResults={setHideResults}
                  onlyHideUnknownChars={onlyHideUnknownChars}
                  setOnlyHideUnknownChars={setOnlyHideUnknownChars}
                  setOnlyAllowWordListGuesses={setOnlyAllowWordListGuesses}
                  numResultsShown={numResultsShown}
                  setNumResultsShown={setNumResultsShown}
                  doAnimations={doAnimations}
                  setDoAnimations={setDoAnimations}
                />
              </ScrollArea>
            </CustomWordsFormContext>
          </AppShell.Navbar>

          <AppShell.Main>
            <GuessInputList
              guesses={guesses}
              setGuesses={setGuesses}
              wordSets={parsedWordSets.wordSets}
              onlyAllowWordListGuesses={onlyAllowWordListGuesses}
              doAnimations={doAnimations}
            />
            <Button disabled={!guesses.length} onClick={handleGetPossibleWords}>
              Get Possible Words!
            </Button>

            {showResults && (
              <Results
                results={results}
                numberToShow={numResultsShown}
                triggerUpdate={resultUpdateKey}
                doAnimations={doAnimations}
              />
            )}
          </AppShell.Main>
        </AppShell>
      </MantineProvider>
    </>
  );
}
