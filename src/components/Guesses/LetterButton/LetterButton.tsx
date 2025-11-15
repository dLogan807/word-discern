import React, { useEffect, useState, useContext, useRef } from "react";
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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animDuration = 200;

  // Only change color once letter is hidden (flipped)
  useEffect(() => {
    if (!flipped) {
      setBackgroundColor(letter.correctness);
    }
  }, [flipped]);

  const resetFlipped = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setFlipped(false);
  };

  const handleClick = () => {
    setFlipped(!flipped);
    updateGuess(guess);
    letter.cycleLetterCorrectness();

    // Fallback timeout to ensure state resets even if onTransitionEnd doesn't fire
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      resetFlipped();
    }, animDuration + 50);
  };

  // Cleanup timeout when unmounted
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <UnstyledButton
      classNames={{
        root: classes.letter_button,
      }}
      onClick={handleClick}
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
        onTransitionEnd={resetFlipped}
      >
        {letter.value.toLocaleUpperCase()}
      </Flex>
    </UnstyledButton>
  );
}
