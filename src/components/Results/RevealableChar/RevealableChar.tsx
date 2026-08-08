import { Button, Text } from "@mantine/core";
import classes from "./RevealableChar.module.css";

export enum CharRevealState {
  REVEALED,
  HIDDEN,
  PERM_REVEALED,
}

export default function RevealableChar({
  char,
  index,
  revealState,
  toggleCharRevealed,
}: {
  char: string;
  index: number;
  revealState: CharRevealState;
  toggleCharRevealed: (index: number) => void;
}) {
  const shownChar = isLetterRevealed(revealState) ? char : "?";

  function handleClick() {
    toggleCharRevealed(index);
  }

  return revealState === CharRevealState.PERM_REVEALED ? (
    <Text>{char}</Text>
  ) : (
    <Button
      onClick={handleClick}
      variant="default"
      classNames={{
        root: classes.result_char_button,
      }}
    >
      <Text>{shownChar}</Text>
    </Button>
  );
}

function isLetterRevealed(revealState: CharRevealState) {
  return revealState !== CharRevealState.HIDDEN;
}
