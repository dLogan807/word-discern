import { Popover, ScrollArea, Box, Text, ActionIcon } from "@mantine/core";
import { IconHelp } from "@tabler/icons-react";
import CharacterBadge from "@/components/Badges/CharacterBadge/CharacterBadge";
import { LetterCorrectness } from "@/enums/enums";
import { getTextualLetterCorrectness } from "@/utils/letterCorrectness";
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
          <IconHelp aria-label="Help button" />
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
              equivalentLetterCorrectness={LetterCorrectness.Correct}
            />
            <CharacterColourExplanation
              colour={LetterCorrectness.WrongPosition}
              character="A"
              separator="="
              explanation="Required elsewhere in the word"
              equivalentLetterCorrectness={LetterCorrectness.WrongPosition}
            />
            <CharacterColourExplanation
              colour={LetterCorrectness.NotPresent}
              character="A"
              separator="="
              explanation="Not in the word"
              equivalentLetterCorrectness={LetterCorrectness.NotPresent}
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
  equivalentLetterCorrectness: LetterCorrectness;
};

function CharacterColourExplanation({
  character,
  colour,
  separator,
  explanation,
  equivalentLetterCorrectness,
}: CharacterColourExplanationProps) {
  const textualLetterCorrectness = getTextualLetterCorrectness(equivalentLetterCorrectness);

  return (
    <Box
      className={classes.character_colour_explanation_box}
      aria-label={`'${textualLetterCorrectness}' ${separator} ${explanation}`}
    >
      <CharacterBadge colour={colour} character={character} ariaHidden />
      <Text aria-hidden="true">{separator}</Text>
      <Text aria-hidden="true">{explanation}</Text>
    </Box>
  );
}
