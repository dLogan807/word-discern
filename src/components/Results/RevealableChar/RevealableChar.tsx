import { Button, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import classes from "./RevealableChar.module.css";

export default function RevealableChar({
  char,
  index,
  hide = true,
  updateHidden,
}: {
  char: string;
  index: number;
  hide?: boolean;
  updateHidden: (index: number, hidden: boolean) => void;
}) {
  const [hidden, setHidden] = useState(hide);
  useEffect(() => {
    setHidden(hide);
  }, [hide]);

  useEffect(() => {
    updateHidden(index, hidden);
  }, [hidden]);

  const shownChar = hidden ? "?" : char;

  return (
    <Button
      onClick={() => setHidden(!hidden)}
      variant="default"
      classNames={{
        root: classes.result_char_button,
      }}
    >
      <Text>{shownChar}</Text>
    </Button>
  );
}
