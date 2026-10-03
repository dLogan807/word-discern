import { Box } from "@mantine/core";
import { Guess } from "@/classes/guess";
import LetterButton from "@/components/Buttons/LetterButton/LetterButton";
import RemoveButton from "@/components/Buttons/RemoveButton/RemoveButton";
import classes from "./GuessItem.module.css";

type GuessItemProps = {
  guess: Guess;
  guessIndex: number;
};

export default function GuessItem({ guess, guessIndex }: GuessItemProps) {
  return (
    <Box className={classes.guess_box}>
      <Box className={classes.guess_chars}>
        {guess.letters.map((letter, idx) => (
          <LetterButton key={idx} letter={letter} letterIndex={idx} guessIndex={guessIndex} />
        ))}
      </Box>
      <RemoveButton guess={guess} />
    </Box>
  );
}
