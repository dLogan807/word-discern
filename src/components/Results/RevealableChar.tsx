import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import classes from "./RevealableChar.module.css";

export default function RevealableChar({
  char,
  index,
  reveal,
  updateRevealed,
}: {
  char: string;
  index: number;
  reveal?: boolean;
  updateRevealed: (index: number, revealed: boolean) => void;
}) {
  reveal = reveal ?? false;
  const [revealed, setRevealed] = useState<boolean>(reveal);
  useEffect(() => {
    setRevealed(reveal);
  }, [reveal]);

  useEffect(() => {
    updateRevealed(index, revealed);
  }, [revealed]);

  const shownChar = revealed ? char : "_";

  return (
    <Button
      onClick={() => setRevealed(!revealed)}
      variant="outline"
      classNames={{
        root: classes.result_char_button,
      }}
    >
      {shownChar}
    </Button>
  );
}
