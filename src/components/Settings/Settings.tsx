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
import WordsBadges, {
  WordBadgesProps,
} from "@/components/Settings/CustomWordsForm/WordBadges/WordBadges";
import { useSettingsContext } from "@/hooks/useSettingsContext";
import Footer from "../Footer/Footer";
import classes from "./Settings.module.css";

type SettingsProps = {
  wordBadgeData: WordBadgesProps;
};

export default function Settings({ wordBadgeData }: SettingsProps) {
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
        <SettingsSection title="Guess input" icon={<IconZoomQuestion size={iconSize} />}>
          <Checkbox
            label="Only allow words from the word list"
            onChange={(event) => setOnlyAllowWordListGuesses(event.currentTarget.checked)}
            defaultChecked
          />
        </SettingsSection>
        <SettingsSection title="Results" icon={<IconClipboardData size={iconSize} />}>
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
              <IconRadiusBottomLeft className={hideResults ? "" : classes.disabled_setting} />
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
            />
          </Stack>
        </SettingsSection>
        <SettingsSection title="Word list" icon={<IconBook2 size={iconSize} />}>
          <WordsBadges {...wordBadgeData} />
          <CustomWordsForm />
        </SettingsSection>
        <SettingsSection title="Accessibility" icon={<IconAccessible size={iconSize} />}>
          <Checkbox
            label="Animations"
            checked={doAnimations}
            onChange={(event) => setDoAnimations(event.currentTarget.checked)}
          />
        </SettingsSection>
      </Stack>
      <Footer />
    </Box>
  );
}

function SettingsSection({
  title,
  icon,
  children,
}: {
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
            <Title order={6} classNames={{ root: classes.settings_section_title }}>
              {title}
            </Title>
          </>
        }
      />
      <Stack className={classes.settings_section}>{children}</Stack>
    </Box>
  );
}
