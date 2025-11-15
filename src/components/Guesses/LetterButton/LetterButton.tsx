import React, { useEffect, useState, useContext } from "react";
import { Property } from "csstype";
import { Letter } from "@/classes/letter";
import { Flex, UnstyledButton } from "@mantine/core";
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
    <UnstyledButton
      classNames={{
        root: classes.letter_button,
      }}
      onClick={() => {
        setFlipped(!flipped);
        updateGuess(guess);
        letter.cycleLetterCorrectness();
      }}
      variant="transparent"
    >
      <Flex
        classNames={{
          root: `${classes.letter_button_inner} ${
            flipped ? classes.letter_flipped : ""
          }`.trim(),
        }}
        styles={{
          root: {
            backgroundColor: backgroundColor,
          },
        }}
        onTransitionEnd={() => {
          if (flipped) {
            setFlipped(false);
          }
        }}
      >
        {letter.value.toLocaleUpperCase()}
      </Flex>
    </UnstyledButton>
  );
}
