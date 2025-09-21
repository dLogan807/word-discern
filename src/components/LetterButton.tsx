import React, { useEffect, useState } from "react";
import classes from "./LetterButton.module.css";
import { Property } from "csstype";
import { Letter } from "../classes/letter";
import { Button } from "@mantine/core";

export default function LetterButton({
  letter,
}: {
  letter: Letter;
}): React.ReactElement {
  const [backgroundColor, setBackgroundColor] =
    useState<Property.BackgroundColor>(letter.correctness);

  useEffect(() => {
    setBackgroundColor(letter.correctness);
  }, [letter.correctness]);

  return (
    <Button
      color={backgroundColor}
      classNames={{
        root: classes.root,
      }}
      onClick={() => {
        letter.cycleLetterCorrectness();
      }}
    >
      {letter.value}
    </Button>
  );
}
