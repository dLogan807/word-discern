import React, { useEffect, useState, useContext } from "react";
import classes from "./LetterButton.module.css";
import { Property } from "csstype";
import { Letter } from "../../classes/letter";
import { Button } from "@mantine/core";
import { Guess } from "../../classes/guess";
import { GuessContext } from "../Guesses/Guesses/Guesses";

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
        root: classes.letter_button,
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
