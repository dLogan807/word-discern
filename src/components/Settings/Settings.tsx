import {
  Box,
  Checkbox,
  Divider,
  Group,
  InputLabel,
  Slider,
  Stack,
  Switch,
  Title,
} from "@mantine/core";
import {
  IconAccessible,
  IconBook2,
  IconClipboardData,
  IconRadiusBottomLeft,
  IconZoomQuestion,
} from "@tabler/icons-react";
import { Dispatch, ReactElement, ReactNode, SetStateAction } from "react";
import CustomWordsForm from "@/components/Settings/CustomWordsForm/CustomWordsForm";
import LoadedWordsBadges, {
  WordBadgeData,
} from "@/components/Settings/CustomWordsForm/WordBadges/WordBadges";
import Footer from "./Footer/Footer";
import classes from "./Settings.module.css";

interface SettingsProps {
  wordBadgeData: WordBadgeData;
  setOnlyAllowWordListGuesses: Dispatch<SetStateAction<boolean>>;
  shuffleResults: boolean;
  setShuffleResults: Dispatch<SetStateAction<boolean>>;
  hideResults: boolean;
  setHideResults: Dispatch<SetStateAction<boolean>>;
  onlyHideUnknownChars: boolean;
  setOnlyHideUnknownChars: Dispatch<SetStateAction<boolean>>;
  numResultsShown: number;
  setNumResultsShown: Dispatch<SetStateAction<number>>;
  doAnimations: boolean;
  setDoAnimations: Dispatch<SetStateAction<boolean>>;
}

export default function Settings(props: SettingsProps) {
  const iconSize = 20;

  return (
    <Box className={classes.settings_layout}>
      <Stack classNames={{ root: classes.settings }}>
        <Title order={2} classNames={{ root: classes.settings_title }}>
          Settings
        </Title>
        <SettingsSection title="Guess input" icon={<IconZoomQuestion size={iconSize} />}>
          <Switch label="Character Mode" disabled />
          <Checkbox
            label="Only allow words from the word list"
            onChange={(event) => props.setOnlyAllowWordListGuesses(event.currentTarget.checked)}
            defaultChecked
          />
        </SettingsSection>
        <SettingsSection title="Results" icon={<IconClipboardData size={iconSize} />}>
          <Checkbox
            label="Shuffled"
            checked={props.shuffleResults}
            onChange={(event) => props.setShuffleResults(event.currentTarget.checked)}
          />
          <Box>
            <Checkbox
              label="Hidden"
              checked={props.hideResults}
              onChange={(event) => props.setHideResults(event.currentTarget.checked)}
            />
            <Group classNames={{ root: `${classes.indented_setting}` }}>
              <IconRadiusBottomLeft className={props.hideResults ? "" : classes.disabled_setting} />
              <Checkbox
                label="Only hide unknown characters"
                checked={props.onlyHideUnknownChars}
                disabled={!props.hideResults}
                onChange={(event) => props.setOnlyHideUnknownChars(event.currentTarget.checked)}
              />
            </Group>
          </Box>
          <Stack classNames={{ root: classes.setting_slider }}>
            <InputLabel>
              Number to display: <b>{props.numResultsShown}</b>
            </InputLabel>
            <Slider
              onChangeEnd={props.setNumResultsShown}
              domain={[0, 100]}
              defaultValue={20}
              min={5}
              max={100}
              step={5}
              size="lg"
            />
          </Stack>
        </SettingsSection>
        <SettingsSection title="Word list" icon={<IconBook2 size={iconSize} />}>
          <LoadedWordsBadges badgeData={props.wordBadgeData} />
          <CustomWordsForm />
        </SettingsSection>
        <SettingsSection title="Accessibility" icon={<IconAccessible size={iconSize} />}>
          <Checkbox
            label="Animations"
            checked={props.doAnimations}
            onChange={(event) => props.setDoAnimations(event.currentTarget.checked)}
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
