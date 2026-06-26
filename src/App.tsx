import "@mantine/core/styles.css";
import wordsUrl from "/words.txt?url";
import {
  AppShell,
  Burger,
  Button,
  Group,
  MantineProvider,
  ScrollArea,
  Title,
  v8CssVariablesResolver,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createContext, Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { Guess } from "@/classes/guess";
import GuessInputList from "@/components/Guesses/GuessInputList/GuessInputList";
import Results from "@/components/Results/Results";
import {
  CustomWordsFormData,
  DEFAULT_CUSTOM_WORDS_FORM,
} from "@/components/Settings/CustomWordsForm/CustomWordsForm";
import Settings from "@/components/Settings/Settings";
import { ThemeSelector } from "@/components/ThemeSelector/ThemeSelector";
import { theme } from "@/theme";
import getResults, { IResults } from "@/utils/resultBuilder";
import { ParsedWordSets, parseWordsToSets } from "@/utils/wordLoading";
import classes from "./App.module.css";

export const CustomWordsFormContext = createContext<Dispatch<SetStateAction<CustomWordsFormData>>>(
  () => {}
);

async function getWords(): Promise<string[]> {
  const res = await fetch(wordsUrl);
  const rawWords = await res.text();
  return rawWords.split("\n").filter(Boolean);
}

export default function App() {
  const [defaultWords, setDefaultWords] = useState<string[]>([]);
  const [navbarOpened, { toggle }] = useDisclosure();

  useEffect(() => {
    void getWords().then(setDefaultWords);
  }, []);

  // Word data
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [results, setResults] = useState<IResults>({
    words: [],
    revealedCharPositions: [],
  });
  const [storedCustomWordsFormData, setStoredCustomWordsFormData] =
    useState<CustomWordsFormData>(DEFAULT_CUSTOM_WORDS_FORM);
  const parsedWordSets: ParsedWordSets = useMemo(() => {
    const mergedWords: string[] = storedCustomWordsFormData.replaceDefaultWords
      ? storedCustomWordsFormData.words
      : [...defaultWords, ...storedCustomWordsFormData.words];

    return parseWordsToSets(mergedWords, storedCustomWordsFormData.allowSpecialChars);
  }, [defaultWords, storedCustomWordsFormData]);

  // Result state
  const [showResults, setShowResults] = useState(false);
  const [resultUpdateKey, setResultUpdateKey] = useState(0);

  // Settings
  const [onlyAllowWordListGuesses, setOnlyAllowWordListGuesses] = useState(true);
  const [shuffleResults, setShuffleResults] = useState(true);
  const [hideResults, setHideResults] = useState(true);
  const [onlyHideUnknownChars, setOnlyHideUnknownChars] = useState(true);
  const [numResultsShown, setNumResultsShown] = useState(20);
  const [doAnimations, setDoAnimations] = useState(true);

  function handleGetPossibleWords() {
    if (guesses.length === 0 || !guesses[0]) return;

    const guessLength = guesses[0].wordString.length;
    const wordSet = parsedWordSets.wordSets.get(guessLength);
    if (wordSet === undefined) return;

    const newResults = getResults(wordSet, guesses, shuffleResults);
    setResults({
      ...newResults,
      revealedCharPositions: onlyHideUnknownChars ? newResults.revealedCharPositions : [],
      defaultHidden: hideResults,
    });

    setResultUpdateKey((prev) => prev + 1);
    setShowResults(true);
  }

  return (
    <>
      <MantineProvider
        theme={theme}
        defaultColorScheme="auto"
        cssVariablesResolver={v8CssVariablesResolver}
      >
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
              <Burger opened={navbarOpened} onClick={toggle} hiddenFrom="sm" size="sm" />
              <Title order={1}>Word Discern</Title>
            </Group>

            <ThemeSelector />
          </AppShell.Header>

          <AppShell.Navbar>
            <CustomWordsFormContext value={setStoredCustomWordsFormData}>
              <ScrollArea type="auto">
                <Settings
                  wordBadgeData={{
                    replaceDefaultWords: storedCustomWordsFormData.replaceDefaultWords,
                    numDefaultWords: defaultWords.length,
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
                key={`${resultUpdateKey}-${results.words.length}`}
                results={results}
                numberToShow={numResultsShown}
                doAnimations={doAnimations}
              />
            )}
          </AppShell.Main>
        </AppShell>
      </MantineProvider>
    </>
  );
}
