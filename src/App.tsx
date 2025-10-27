import "@mantine/core/styles.css";
import {
  AppShell,
  Burger,
  Button,
  Checkbox,
  Divider,
  Group,
  MantineProvider,
  Paper,
  Stack,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import { theme } from "./theme";
import { useDisclosure } from "@mantine/hooks";
import { DEFAULT_WORDS } from "./assets/words";
import Results from "./components/Results/Results";
import { ReactElement, useEffect, useState } from "react";
import { Guess } from "./classes/guess";
import getResults from "./utils/resultBuilder";
import CustomWordsForm, {
  CustomWordsFormData,
  DEFAULT_CUSTOM_WORDS_FORM,
} from "./components/CustomWordsForm/CustomWordsForm";
import { ParsedWordSets, parseWordsToSets } from "./utils/wordLoading";
import Guesses from "./components/Guesses/Guesses";
import { ThemeSelector } from "./components/ThemeSelector/ThemeSelector";
import classes from "./App.module.css";
import {
  IconBook2,
  IconClipboardData,
  IconZoomQuestion,
} from "@tabler/icons-react";

export default function App() {
  const [navbarOpened, { toggle }] = useDisclosure();

  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [shuffleResults, setShuffleResults] = useState<boolean>(true);

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
            <Stack classNames={{ root: classes.settings }}>
              <Title order={3}>Settings</Title>
              <SettingsSection
                title="Guess input"
                icon={<IconZoomQuestion size={20} />}
              />
              <Switch
                label="Keyboard Mode"
                classNames={{ root: classes.setting_switch }}
              />
              <SettingsSection
                title="Results"
                icon={<IconClipboardData size={20} />}
              />
              <Checkbox
                label="Shuffled"
                checked={shuffleResults}
                onChange={(event) =>
                  setShuffleResults(event.currentTarget.checked)
                }
                classNames={{ root: classes.setting_switch }}
              />
              <Checkbox
                label="Hidden by default"
                classNames={{ root: classes.setting_switch }}
              />
              <SettingsSection
                title="Custom words"
                icon={<IconBook2 size={20} />}
              />
              <Paper classNames={{ root: classes.custom_words_container }}>
                <CustomWordsForm
                  setFormData={setCustomWordsFormData}
                  badgeData={{
                    replaceDefaultWords:
                      customWordsFormData.replaceDefaultWords,
                    numDefaultWords: DEFAULT_WORDS.length,
                    numWordsParsed: parsedWordSets.wordNum,
                    numCustomFormWords: customWordsFormData.words.length,
                    failedWords: parsedWordSets.failed,
                  }}
                />
              </Paper>
            </Stack>
          </AppShell.Navbar>

          <AppShell.Main>
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

function SettingsSection({
  title,
  icon,
}: {
  title: string;
  icon: ReactElement;
}) {
  //Note to self -> next add padding between settings section icon and title!
  return (
    <>
      <Divider
        my="xs"
        labelPosition="left"
        label={
          <>
            {icon}
            <Title
              order={6}
              classNames={{ root: classes.settings_section_title }}
            >
              {title}
            </Title>
          </>
        }
      />
    </>
  );
}
