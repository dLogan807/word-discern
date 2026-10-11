import { Box } from "@mantine/core";
import { Suspense } from "react";
import GuessItem from "@/components/Guesses/GuessItem/GuessItem";
import GuessAutocompleteInputSkeleton from "@/components/Skeletons/GuessAutocompleteInputSkeleton/GuessAutocompleteInputSkeleton";
import { useGuessContext } from "@/hooks/useGuessContext";
import GuessAutocompleteInput from "../GuessAutocompleteInput/GuessAutocompleteInput";
import classes from "./GuessInputList.module.css";

export default function GuessInputList() {
  const { guesses } = useGuessContext();

  return (
    <>
      <Suspense fallback={<GuessAutocompleteInputSkeleton />}>
        <GuessAutocompleteInput />
      </Suspense>

      {guesses.length > 0 && (
        <Box className={classes.guess_list}>
          {guesses.map((guess, idx) => (
            <Suspense key={guess.wordString}>
              <GuessItem key={guess.wordString} guess={guess} guessIndex={idx} />
            </Suspense>
          ))}
        </Box>
      )}
    </>
  );
}
