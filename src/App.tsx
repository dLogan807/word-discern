import "@mantine/core/styles.css";
import { ActionIcon, Box, Button, Group, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSearch, IconSettings, IconXFilled } from "@tabler/icons-react";
import { useState } from "react";
import { Guess } from "@/classes/guess";
import GuessInputList from "@/components/Guesses/GuessInputList/GuessInputList";
import Results from "@/components/Results/Results";
import Settings from "@/components/Settings/Settings";
import getResults, { EMPTY_RESULTS, IResults } from "@/utils/resultBuilder";
import { ThemeSelector } from "./components/Buttons/ThemeSelector/ThemeSelector";
import HelpPopover from "./components/Overlays/HelpPopover/HelpPopover";
import { useSettingsContext } from "./hooks/useSettingsContext";
import { useWordListContext } from "./hooks/useWordListContext";
import classes from "./App.module.css";

export default function App() {
  const {
    customWordsFormData,
    doAnimations,
    hideResults,
    numResultsShown,
    onlyHideUnknownChars,
    showHelpButton,
    shuffleResults,
  } = useSettingsContext();

  const { wordSets } = useWordListContext();

  // Word data
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [results, setResults] = useState<IResults>(EMPTY_RESULTS);

  // Result state
  const [showResults, setShowResults] = useState(false);
  const [resultsUpdateKey, setResultsUpdateKey] = useState(0);

  // Settings
  const [settingsOpened, { toggle }] = useDisclosure(false);

  function handleGetPossibleWords() {
    if (guesses.length === 0 || !guesses[0]) return;

    const guessLength = guesses[0].wordString.length;
    const wordSet = wordSets.get(guessLength);
    if (wordSet === undefined) {
      setResults(EMPTY_RESULTS);
      return;
    }

    const newResults = getResults(wordSet, guesses, shuffleResults, onlyHideUnknownChars);
    setResults({
      ...newResults,
      defaultHidden: hideResults,
    });

    setResultsUpdateKey((prev) => prev + 1);
    setShowResults(true);
  }

  return (
    <Box
      className={`${classes.layout}
            ${!settingsOpened ? classes.layout_settings_pane_closed : undefined}
            ${!doAnimations ? classes.no_animation : undefined}
          `}
    >
      <Box className={classes.header}>
        <Title order={1} classNames={{ root: classes.header_logo }}>
          Word Discern
        </Title>

        <Group>
          <ThemeSelector />
          <ActionIcon
            variant="transparent"
            aria-label="Settings"
            onClick={toggle}
            classNames={{
              root: classes.settings_button,
              icon: `${classes.settings_button_icon}
                  ${settingsOpened ? classes.settings_button_icon_opened : undefined}
                  ${!doAnimations ? classes.no_animation : undefined}`,
            }}
          >
            {settingsOpened ? <IconXFilled /> : <IconSettings />}
          </ActionIcon>
        </Group>
      </Box>

      <Box
        className={`${classes.settings_pane}
            ${!settingsOpened ? classes.settings_pane_closed : undefined}
            ${!doAnimations ? classes.no_animation : undefined}`}
      >
        <Settings
          replaceDefaultWords={customWordsFormData.replaceDefaultWords}
          numCustomFormWords={customWordsFormData.words.length}
        />
      </Box>

      <Box className={classes.content_body}>
        <GuessInputList guesses={guesses} setGuesses={setGuesses} />
        <Button
          variant="filled"
          onClick={handleGetPossibleWords}
          disabled={!guesses.length}
          rightSection={<IconSearch />}
        >
          Find possible words
        </Button>
        {showResults && (
          <Results
            results={results}
            resultsUpdateKey={resultsUpdateKey}
            numberToShow={numResultsShown}
            doAnimations={doAnimations}
          />
        )}
        {showHelpButton && <HelpPopover />}
      </Box>
    </Box>
  );
}
