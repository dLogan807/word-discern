import { Box } from "@mantine/core";
import React from "react";
import { Guess } from "@/classes/guess";
import LetterButton from "@/components/Guesses/LetterButton/LetterButton";
import RemoveButton from "@/components/Guesses/RemoveButton/RemoveButton";
import classes from "./GuessItem.module.css";

export default function GuessItem({ guess }: { guess: Guess }): React.ReactElement {
  return (
    <Box className={classes.guess_item}>
      {guess.letters.map((letter, idx) => (
        <LetterButton key={idx} letter={letter} guess={guess} />
      ))}
      <RemoveButton guess={guess} />
    </Box>
  );
}
