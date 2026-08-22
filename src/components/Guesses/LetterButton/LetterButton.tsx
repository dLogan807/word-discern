import { Box, UnstyledButton } from "@mantine/core";
import { useState, useContext, AnimationEvent } from "react";
import { Guess } from "@/classes/guess";
import { Letter } from "@/classes/letter";
import { GuessContext } from "@/components/Guesses/GuessInputList/GuessInputList";
import classes from "./LetterButton.module.css";

type LetterButtonProps = {
  letter: Letter;
  guess: Guess;
};

enum FlipPhase {
  Idle,
  FlippingIn,
  FlippingOut,
}

export default function LetterButton({ letter, guess }: LetterButtonProps) {
  const { updateGuess, doAnimations } = useContext(GuessContext);
  const halfFlipAnimDuration = doAnimations ? 150 : 0;

  const [displayCorrectness, setDisplayCorrectness] = useState(letter.correctness);
  const initialPhase = doAnimations ? FlipPhase.FlippingIn : FlipPhase.Idle;
  const [phase, setPhase] = useState<FlipPhase>(initialPhase);

  function handleClick() {
    const nextCorrectness = letter.getNextLetterCorrectness();
    const updatedLetter = new Letter(letter.value, nextCorrectness);

    updateGuess({
      ...guess,
      letters: guess.letters.map((l) => (l === letter ? updatedLetter : l)),
    });

    if (!doAnimations) {
      setDisplayCorrectness(nextCorrectness);
      return;
    }

    if (phase === FlipPhase.Idle) {
      setPhase(FlipPhase.FlippingOut);
    }
  }

  // Set colour after first half of flip
  function handleAnimationEnd(event: AnimationEvent<HTMLDivElement>) {
    if (event.animationName === classes.letterFlipOut) {
      setDisplayCorrectness(letter.correctness);
      setPhase(FlipPhase.FlippingIn);
    } else if (event.animationName === classes.letterFlipIn) {
      // Continue flipping if there are more clicks since last colour capture
      setPhase(letter.correctness !== displayCorrectness ? FlipPhase.FlippingOut : FlipPhase.Idle);
    }
  }

  const animationName =
    phase === FlipPhase.FlippingOut
      ? classes.letterFlipOut
      : phase === FlipPhase.FlippingIn
        ? classes.letterFlipIn
        : "none";

  return (
    <UnstyledButton classNames={{ root: classes.letter_button }} onClick={handleClick}>
      <Box
        className={classes.letter_button_inner}
        style={{
          backgroundColor: displayCorrectness,
          animationName,
          animationDuration: `${halfFlipAnimDuration}ms`,
          animationFillMode: "both",
        }}
        onAnimationEnd={handleAnimationEnd}
      >
        {letter.value.toLocaleUpperCase()}
      </Box>
    </UnstyledButton>
  );
}
