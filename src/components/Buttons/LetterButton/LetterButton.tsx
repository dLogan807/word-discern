import { Box, UnstyledButton } from "@mantine/core";
import { useState, AnimationEvent } from "react";
import { Letter } from "@/classes/letter";
import { useGuessContext } from "@/hooks/useGuessContext";
import { useSettingsContext } from "@/hooks/useSettingsContext";
import classes from "./LetterButton.module.css";

type LetterButtonProps = {
  letter: Letter;
  letterIndex: number;
  guessIndex: number;
};

enum FlipPhase {
  Idle,
  FlippingIn,
  FlippingOut,
}

export default function LetterButton({ letter, letterIndex, guessIndex }: LetterButtonProps) {
  const { setNextLetterCorrectnessForAllGuesses } = useGuessContext();
  const { doAnimations } = useSettingsContext();

  const halfFlipAnimDuration = doAnimations ? 150 : 0;

  const [displayCorrectness, setDisplayCorrectness] = useState(letter.correctness);
  const [lastSeenCorrectness, setLastSeenCorrectness] = useState(letter.correctness);
  const initialPhase = doAnimations ? FlipPhase.FlippingIn : FlipPhase.Idle;
  const [phase, setPhase] = useState<FlipPhase>(initialPhase);

  if (letter.correctness !== lastSeenCorrectness) {
    setLastSeenCorrectness(letter.correctness);

    if (!doAnimations) {
      setDisplayCorrectness(letter.correctness);
    } else if (phase === FlipPhase.Idle) {
      setPhase(FlipPhase.FlippingOut);
    }
  }

  function handleClick() {
    setNextLetterCorrectnessForAllGuesses(letter, letterIndex, guessIndex);
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

  const char = letter.value.toLocaleUpperCase();

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
        {char}
      </Box>
    </UnstyledButton>
  );
}
