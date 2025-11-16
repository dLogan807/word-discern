import {
  Box,
  Checkbox,
  Divider,
  Group,
  Stack,
  Switch,
  Title,
} from "@mantine/core";
import LoadedWordsBadges, {
  WordBadgeData,
} from "@/components/Settings/CustomWordsForm/WordBadges/WordBadges";
import CustomWordsForm from "@/components/Settings/CustomWordsForm/CustomWordsForm";
import {
  IconBook2,
  IconClipboardData,
  IconRadiusBottomLeft,
  IconZoomQuestion,
} from "@tabler/icons-react";
import { Dispatch, ReactElement, SetStateAction } from "react";
import classes from "./Settings.module.css";

interface SettingsProps {
  wordBadgeData: WordBadgeData;
  shuffleResults: boolean;
  setShuffleResults: Dispatch<SetStateAction<boolean>>;
  hideResults: boolean;
  setHideResults: Dispatch<SetStateAction<boolean>>;
  onlyHideUnknownChars: boolean;
  setOnlyHideUnknownChars: Dispatch<SetStateAction<boolean>>;
  setOnlyAllowWordListGuessesRef: (value: boolean) => void;
}

export default function Settings(props: SettingsProps) {
  return (
    <Stack classNames={{ root: classes.settings }}>
      <Title order={3}>Settings</Title>
      <SettingsDivider
        title="Guess input"
        icon={<IconZoomQuestion size={20} />}
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
          props.setOnlyAllowWordListGuessesRef(event.currentTarget.checked)
        }
        defaultChecked
      />
      <SettingsDivider title="Results" icon={<IconClipboardData size={20} />} />
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
          label="Hide results"
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
            label="Only hide unknown characters"
            checked={props.onlyHideUnknownChars}
            disabled={!props.hideResults}
            onChange={(event) =>
              props.setOnlyHideUnknownChars(event.currentTarget.checked)
            }
          />
        </Group>
      </Box>
      <SettingsDivider title="Word list" icon={<IconBook2 size={20} />} />
      <Stack classNames={{ root: classes.custom_words_container }}>
        <LoadedWordsBadges badgeData={props.wordBadgeData} />
        <CustomWordsForm />
      </Stack>
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
