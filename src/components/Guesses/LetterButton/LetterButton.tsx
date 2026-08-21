import { Box, UnstyledButton } from "@mantine/core";
import { Property } from "csstype";
import { useState, useContext } from "react";
import { Guess } from "@/classes/guess";
import { Letter } from "@/classes/letter";
import { GuessContext } from "@/components/Guesses/GuessInputList/GuessInputList";
import classes from "./LetterButton.module.css";

type LetterButtonProps = {
  letter: Letter;
  guess: Guess;
};

export default function LetterButton({ letter, guess }: LetterButtonProps) {
  const [backgroundColor, setBackgroundColor] = useState<Property.BackgroundColor>(
    letter.correctness
  );
  const [flipped, setFlipped] = useState(false);
  const { updateGuess, doAnimations } = useContext(GuessContext);
  const animDuration = doAnimations ? 150 : 0;

  function resetFlipped() {
    setFlipped(false);
    setBackgroundColor(letter.correctness);
  }

  function handleClick() {
    if (doAnimations) {
      setBackgroundColor(letter.correctness);
    }
    setFlipped(!flipped);
    updateGuess(guess);
    letter.cycleLetterCorrectness();
    if (!doAnimations) {
      setBackgroundColor(letter.correctness);
    }
  }

  return (
    <UnstyledButton
      classNames={{
        root: classes.letter_button,
      }}
      onClick={handleClick}
    >
      <Box
        key={`${flipped}`}
        className={classes.letter_button_inner}
        style={{
          backgroundColor: backgroundColor,
          animationName: classes.letterFlip,
          animationDuration: `${animDuration}ms`,
          animationDirection: flipped ? "normal" : "reverse",
          animationFillMode: "both",
        }}
        onAnimationEnd={resetFlipped}
      >
        {letter.value.toLocaleUpperCase()}
      </Box>
    </UnstyledButton>
  );
}
