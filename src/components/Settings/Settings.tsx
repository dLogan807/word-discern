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
import LoadedWordsBadges, {
  WordBadgeData,
} from "@/components/Settings/CustomWordsForm/WordBadges/WordBadges";
import CustomWordsForm from "@/components/Settings/CustomWordsForm/CustomWordsForm";
import {
  IconAccessible,
  IconBook2,
  IconClipboardData,
  IconRadiusBottomLeft,
  IconZoomQuestion,
} from "@tabler/icons-react";
import { Dispatch, ReactElement, SetStateAction } from "react";
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
    <Stack classNames={{ root: classes.settings }}>
      <Title order={3}>Settings</Title>
      <SettingsDivider
        title="Guess input"
        icon={<IconZoomQuestion size={iconSize} />}
      />
      <Switch
        label="Keyboard Mode"
        classNames={{ root: classes.setting_switch }}
        disabled
      />
      <Checkbox
        label="Only allow words from the word list"
        classNames={{ root: classes.setting_switch }}
        onChange={(event) =>
          props.setOnlyAllowWordListGuesses(event.currentTarget.checked)
        }
        defaultChecked
      />
      <SettingsDivider
        title="Results"
        icon={<IconClipboardData size={iconSize} />}
      />
      <Checkbox
        label="Shuffled"
        checked={props.shuffleResults}
        onChange={(event) =>
          props.setShuffleResults(event.currentTarget.checked)
        }
        classNames={{ root: classes.setting_switch }}
      />
      <Box>
        <Checkbox
          label="Hidden"
          checked={props.hideResults}
          onChange={(event) =>
            props.setHideResults(event.currentTarget.checked)
          }
          classNames={{ root: classes.setting_switch }}
        />
        <Group
          classNames={{
            root: `${classes.indented_setting}`,
          }}
        >
          <IconRadiusBottomLeft
            className={props.hideResults ? "" : classes.disabled_setting}
          />
          <Checkbox
            label="Only hide unknown characters (WIP)"
            checked={props.onlyHideUnknownChars}
            //disabled={!props.hideResults}
            disabled
            onChange={(event) =>
              props.setOnlyHideUnknownChars(event.currentTarget.checked)
            }
          />
        </Group>
      </Box>
      <Stack classNames={{ root: classes.setting_slider }}>
        <InputLabel>Number displayed: {props.numResultsShown}</InputLabel>
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
      <SettingsDivider title="Word list" icon={<IconBook2 size={iconSize} />} />
      <Stack classNames={{ root: classes.custom_words_container }}>
        <LoadedWordsBadges badgeData={props.wordBadgeData} />
        <CustomWordsForm />
      </Stack>
      <SettingsDivider
        title="Accessibility"
        icon={<IconAccessible size={iconSize} />}
      />
      <Checkbox
        label="Animations"
        classNames={{ root: classes.setting_switch }}
        checked={props.doAnimations}
        onChange={(event) => props.setDoAnimations(event.currentTarget.checked)}
      />
    </Stack>
  );
}

function SettingsDivider({
  title,
  icon,
}: {
  title: string;
  icon: ReactElement;
}) {
  return (
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
  );
}
