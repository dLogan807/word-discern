import React, { useEffect, useState, useContext } from "react";
import { Property } from "csstype";
import { Letter } from "@/classes/letter";
import { Button } from "@mantine/core";
import { Guess } from "@/classes/guess";
import { GuessContext } from "@/components/Guesses/GuessInputList/GuessInputList";
import classes from "./LetterButton.module.css";

export default function LetterButton({
  letter,
  guess,
}: {
  letter: Letter;
  guess: Guess;
}): React.ReactElement {
  const [backgroundColor, setBackgroundColor] =
    useState<Property.BackgroundColor>(letter.correctness);
  const [flipped, setFlipped] = useState(false);
  const { updateGuess } = useContext(GuessContext);

  useEffect(() => {
    setBackgroundColor(letter.correctness);
  }, [letter.correctness]);

  return (
    <Button
      classNames={{
        root: classes.letter_button,
        label: `${classes.letter_button_label} ${
          flipped ? classes.letter_flipped : ""
        }`.trim(),
      }}
      styles={{
        label: {
          backgroundColor: backgroundColor,
        },
      }}
      onTransitionEnd={() => {
        if (flipped) {
          setFlipped(false);
        }
      }}
      onClick={() => {
        setFlipped(true);
        letter.cycleLetterCorrectness();
        updateGuess(guess);
      }}
      variant="transparent"
    >
      {letter.value.toLocaleUpperCase()}
    </Button>
  );
}
