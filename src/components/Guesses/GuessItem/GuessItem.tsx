import { Box, RollingNumber, Text } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { Guess } from "@/classes/guess";
import LetterButton from "@/components/Buttons/LetterButton/LetterButton";
import RemoveButton from "@/components/Buttons/RemoveButton/RemoveButton";
import { useGuessContext } from "@/hooks/useGuessContext";
import { useSettingsContext } from "@/hooks/useSettingsContext";
import { useWordListContext } from "@/hooks/useWordListContext";
import getResults from "@/utils/resultBuilder";
import classes from "./GuessItem.module.css";

type GuessItemProps = {
  guess: Guess;
  guessIndex: number;
};

export default function GuessItem({ guess, guessIndex }: GuessItemProps) {
  const { guesses } = useGuessContext();
  const { wordSets } = useWordListContext();
  const { doAnimations, showPossibleWordNumAfterEachGuess } = useSettingsContext();
  const wordSet = wordSets.get(guesses[0]?.wordString.length);

  const [possibleWordsUpToGuessIndex] = useDebouncedValue(
    showPossibleWordNumAfterEachGuess
      ? getPossibleWordsUpToGuessIndex(wordSet, guesses, guessIndex)
      : undefined,
    500
  );

  return (
    <Box className={classes.guess_box}>
      <Box className={classes.guess_box_inner}>
        <Box className={classes.guess_chars}>
          {guess.letters.map((letter, idx) => (
            <LetterButton key={idx} letter={letter} letterIndex={idx} guessIndex={guessIndex} />
          ))}
        </Box>
        {possibleWordsUpToGuessIndex !== undefined && (
          <Box className={classes.possible_words_box}>
            <RollingNumber
              value={possibleWordsUpToGuessIndex}
              animationDuration={doAnimations ? 600 : 0}
              classNames={{ root: classes.possible_words_text }}
            />
            <Text classNames={{ root: classes.possible_words_text }}>possible</Text>
          </Box>
        )}
      </Box>
      <RemoveButton guess={guess} />
    </Box>
  );
}

function getPossibleWordsUpToGuessIndex(
  wordSet: Set<string> | undefined,
  guesses: Guess[],
  index: number
): number | undefined {
  if (!guesses.length || !wordSet) return undefined;

  const guessesUpToThisIndex = guesses.slice(0, index + 1);

  return getResults(wordSet, guessesUpToThisIndex).words.length;
}
