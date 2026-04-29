import { Button, Text } from "@mantine/core";
import { useState } from "react";
import classes from "./RevealableChar.module.css";

export default function RevealableChar({
  char,
  index,
  reveal = false,
  updateRevealed,
}: {
  char: string;
  index: number;
  reveal?: boolean;
  updateRevealed: (index: number, hidden: boolean) => void;
}) {
  const [revealed, setRevealed] = useState(reveal);
  function handleClick() {
    const nextRevealed = !revealed;
    setRevealed(nextRevealed);
    updateRevealed(index, nextRevealed);
  }

  const shownChar = revealed ? char : "?";

  return (
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
