import React, { useEffect, useState, useContext } from "react";
import classes from "./LetterButton.module.css";
import { Property } from "csstype";
import { Letter } from "../classes/letter";
import { Button } from "@mantine/core";
import { GuessContext } from "../App";
import { Guess } from "../classes/guess";

export default function LetterButton({
  letter,
  guess,
}: {
  letter: Letter;
  guess: Guess;
}): React.ReactElement {
  const [backgroundColor, setBackgroundColor] =
    useState<Property.BackgroundColor>(letter.correctness);
  const { updateGuess } = useContext(GuessContext);

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
        updateGuess(guess);
      }}
    >
      {letter.value.toLocaleUpperCase()}
    </Button>
  );
}
