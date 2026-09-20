import { Box, Checkbox, Divider, Group, InputLabel, Slider, Stack, Title } from "@mantine/core";
import {
  IconAccessible,
  IconBook2,
  IconClipboardData,
  IconRadiusBottomLeft,
  IconZoomQuestion,
} from "@tabler/icons-react";
import { ReactElement, ReactNode } from "react";
import CustomWordsForm from "@/components/Settings/CustomWordsForm/CustomWordsForm";
import WordsBadges from "@/components/Settings/CustomWordsForm/WordBadges/WordBadges";
import { useSettingsContext } from "@/hooks/useSettingsContext";
import Footer from "../Footer/Footer";
import classes from "./Settings.module.css";

export default function Settings() {
  const {
    setOnlyAllowWordListGuesses,
    shuffleResults,
    setShuffleResults,
    hideResults,
    setHideResults,
    onlyHideUnknownChars,
    setOnlyHideUnknownChars,
    numResultsShown,
    setNumResultsShown,
    showHelpButton,
    setShowHelpButton,
    doAnimations,
    setDoAnimations,
  } = useSettingsContext();

  const iconSize = 20;

  return (
    <Box className={classes.settings_layout}>
      <Stack classNames={{ root: classes.settings }}>
        <Title order={2} classNames={{ root: classes.settings_title }}>
          Settings
        </Title>
        <SettingsSection
          idForAriaLabelledBy="guessInputSettingsSection"
          title="Guess input"
          icon={<IconZoomQuestion aria-labelledby="guessInputSettingsSection" size={iconSize} />}
        >
          <Checkbox
            label="Only allow words from the word list"
            onChange={(event) => setOnlyAllowWordListGuesses(event.currentTarget.checked)}
            defaultChecked
          />
        </SettingsSection>
        <SettingsSection
          idForAriaLabelledBy="resultsSettingsSection"
          title="Results"
          icon={<IconClipboardData aria-labelledby="resultsSettingsSection" size={iconSize} />}
        >
          <Checkbox
            label="Shuffled"
            checked={shuffleResults}
            onChange={(event) => setShuffleResults(event.currentTarget.checked)}
          />
          <Box>
            <Checkbox
              label="Hidden"
              checked={hideResults}
              onChange={(event) => setHideResults(event.currentTarget.checked)}
            />
            <Group classNames={{ root: `${classes.indented_setting}` }}>
              <IconRadiusBottomLeft
                className={hideResults ? "" : classes.disabled_setting}
                aria-label="Path to nested setting"
              />
              <Checkbox
                label="Only hide unknown characters"
                checked={onlyHideUnknownChars}
                disabled={!hideResults}
                onChange={(event) => setOnlyHideUnknownChars(event.currentTarget.checked)}
              />
            </Group>
          </Box>
          <Stack classNames={{ root: classes.setting_slider }}>
            <InputLabel>
              Number to display: <b>{numResultsShown}</b>
            </InputLabel>
            <Slider
              onChangeEnd={setNumResultsShown}
              domain={[0, 100]}
              defaultValue={numResultsShown}
              min={5}
              max={100}
              step={5}
              size="lg"
              thumbLabel="Slider thumb"
            />
          </Stack>
        </SettingsSection>
        <SettingsSection
          idForAriaLabelledBy="wordListSettingsSection"
          title="Word list"
          icon={<IconBook2 aria-labelledby="wordListSettingsSection" size={iconSize} />}
        >
          <WordsBadges />
          <CustomWordsForm />
        </SettingsSection>
        <SettingsSection
          idForAriaLabelledBy="accessibilitySettingsSection"
          title="Accessibility"
          icon={<IconAccessible aria-labelledby="accessibilitySettingsSection" size={iconSize} />}
        >
          <Checkbox
            label="Animations"
            checked={doAnimations}
            onChange={(event) => setDoAnimations(event.currentTarget.checked)}
          />
          <Checkbox
            label="Show help button"
            checked={showHelpButton}
            onChange={(event) => setShowHelpButton(event.currentTarget.checked)}
          />
        </SettingsSection>
      </Stack>
      <Footer />
    </Box>
  );
}

function SettingsSection({
  idForAriaLabelledBy,
  title,
  icon,
  children,
}: {
  idForAriaLabelledBy: string;
  title: string;
  icon: ReactElement;
  children?: ReactNode;
}) {
  return (
    <Box>
      <Divider
        my="xs"
        labelPosition="left"
        label={
          <>
            {icon}
            <Title
              id={idForAriaLabelledBy}
              order={6}
              classNames={{ root: classes.settings_section_title }}
            >
              {title}
            </Title>
          </>
        }
      />
      <Stack className={classes.settings_section}>{children}</Stack>
    </Box>
  );
}
