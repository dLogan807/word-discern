import { Popover, ScrollArea, Box, Text, ActionIcon } from "@mantine/core";
import { IconHelp } from "@tabler/icons-react";
import CharacterBadge from "@/components/Badges/CharacterBadge/CharacterBadge";
import { LetterCorrectness } from "@/enums/enums";
import classes from "./HelpPopover.module.css";

export default function HelpPopover() {
  return (
    <Popover position="bottom" withArrow shadow="md">
      <Popover.Target>
        <ActionIcon
          variant="transparent"
          aria-label="Help"
          classNames={{
            root: classes.icon_root,
            icon: classes.icon_icon,
          }}
        >
          <IconHelp />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <ScrollArea.Autosize mah={250} maw={300}>
          <Box className={classes.all_character_box}>
            <CharacterColourExplanation
              colour={LetterCorrectness.Correct}
              character="A"
              separator="="
              explanation="Correct letter at the correct position"
            />
            <CharacterColourExplanation
              colour={LetterCorrectness.WrongPosition}
              character="A"
              separator="="
              explanation="At the wrong position but required in the word"
            />
            <CharacterColourExplanation
              colour={LetterCorrectness.NotPresent}
              character="A"
              separator="="
              explanation="Not in the word"
            />
          </Box>
        </ScrollArea.Autosize>
      </Popover.Dropdown>
    </Popover>
  );
}

type CharacterColourExplanationProps = {
  character: string;
  colour: string;
  separator: string;
  explanation: string;
};

function CharacterColourExplanation({
  character,
  colour,
  separator,
  explanation,
}: CharacterColourExplanationProps) {
  return (
    <Box className={classes.character_colour_explanation_box}>
      <CharacterBadge colour={colour} character={character} />
      <Text>{separator}</Text>
      <Text>{explanation}</Text>
    </Box>
  );
}
