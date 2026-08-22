import { Box } from "@mantine/core";
import { Guess } from "@/classes/guess";
import LetterButton from "@/components/Guesses/LetterButton/LetterButton";
import RemoveButton from "@/components/Guesses/RemoveButton/RemoveButton";
import classes from "./GuessItem.module.css";

type GuessItemProps = {
  guess: Guess;
};

export default function GuessItem({ guess }: GuessItemProps) {
  return (
    <Box className={classes.guess_item}>
      {guess.letters.map((letter, idx) => (
        <LetterButton key={idx} letter={letter} letterIndex={idx} />
      ))}
      <RemoveButton guess={guess} />
    </Box>
  );
}
