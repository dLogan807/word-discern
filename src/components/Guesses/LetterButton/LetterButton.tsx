import { useEffect, useState, useContext } from "react";
import { Property } from "csstype";
import { Letter } from "@/classes/letter";
import { Box, UnstyledButton } from "@mantine/core";
import { Guess } from "@/classes/guess";
import { GuessContext } from "@/components/Guesses/GuessInputList/GuessInputList";
import classes from "./LetterButton.module.css";

export default function LetterButton({
  letter,
  guess,
}: {
  letter: Letter;
  guess: Guess;
}) {
  const [backgroundColor, setBackgroundColor] =
    useState<Property.BackgroundColor>(letter.correctness);
  const [flipped, setFlipped] = useState(false);
  const { updateGuess, doAnimations } = useContext(GuessContext);
  const animDuration = doAnimations ? 150 : 0;

  // Only change color once letter is hidden (flipped)
  useEffect(() => {
    if (!doAnimations || !flipped) {
      setBackgroundColor(letter.correctness);
    }
  }, [flipped]);

  function resetFlipped() {
    setFlipped(false);
  }

  function handleClick() {
    setFlipped(!flipped);
    updateGuess(guess);
    letter.cycleLetterCorrectness();
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
