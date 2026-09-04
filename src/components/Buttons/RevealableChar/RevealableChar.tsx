import { Button, Text } from "@mantine/core";
import { CharRevealState } from "@/enums/enums";
import classes from "./RevealableChar.module.css";

type RevealableCharProps = {
  char: string;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  revealState: CharRevealState;
  toggleCharRevealed: (index: number) => void;
};

export default function RevealableChar({
  char,
  index,
  isFirst,
  isLast,
  revealState,
  toggleCharRevealed,
}: RevealableCharProps) {
  const shownChar = isLetterRevealed(revealState) ? char : "?";

  function handleClick() {
    toggleCharRevealed(index);
  }

  const edgeClass = [isFirst && classes.first, isLast && classes.last].filter(Boolean).join(" ");

  return revealState === CharRevealState.PERM_REVEALED ? (
    <Text classNames={{ root: classes.perm_revealed }}>{char}</Text>
  ) : (
    <Button
      onClick={handleClick}
      variant="default"
      classNames={{
        root: `${classes.result_char_button} ${edgeClass}`,
      }}
    >
      <Text>{shownChar}</Text>
    </Button>
  );
}

function isLetterRevealed(revealState: CharRevealState) {
  return revealState !== CharRevealState.HIDDEN;
}
