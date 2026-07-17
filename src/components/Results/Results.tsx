import { ActionIcon, Box, Button, Group, RollingNumber, Text } from "@mantine/core";
import { IconArrowDown, IconEye, IconEyeOff } from "@tabler/icons-react";
import { useState } from "react";
import RevealableChar, {
  CharRevealState,
} from "@/components/Results/RevealableChar/RevealableChar";
import capitalizeFirstLetter from "@/utils/capitalizeFirstLetter";
import pluralize from "@/utils/pluralize";
import { IResults } from "@/utils/resultBuilder";
import classes from "./Results.module.css";

export default function Results({
  results,
  resultsUpdateKey,
  numberToShow,
  doAnimations,
}: {
  results: IResults;
  resultsUpdateKey: number;
  numberToShow: number;
  doAnimations: boolean;
}) {
  return (
    <Box className={classes.results_container}>
      <Box className={classes.results_text_container}>
        <Box className={classes.results_text}>
          <RollingNumber
            value={results.words.length}
            animationDuration={doAnimations ? 600 : 0}
            classNames={{ root: classes.results_text_number }}
          />
          {` possible ${pluralize(results.words.length, "word")}`}
        </Box>
      </Box>
      <ResultWords
        key={`${resultsUpdateKey}-${results.words.length}`}
        results={results}
        doAnimations={doAnimations}
        numberToShow={numberToShow}
      />
    </Box>
  );
}

function ResultWords({
  results,
  doAnimations,
  numberToShow,
}: {
  results: IResults;
  doAnimations: boolean;
  numberToShow: number;
}) {
  const clampedNumberToShow = Math.min(numberToShow, results.words.length);

  const [numResultsMounted, setNumResultsMounted] = useState(clampedNumberToShow);
  const [mountedResults, setMountedResults] = useState<boolean[]>(
    new Array(results.words.length).fill(false).map((_mounted, idx) => idx < clampedNumberToShow)
  );

  const baseDelay = doAnimations ? 20 : 0;
  let delay = baseDelay;
  const delayMult = 1.05 + 1 / Math.max(clampedNumberToShow, 1);
  const totalDelay = Math.min(baseDelay * delayMult ** clampedNumberToShow, 500);

  function handleShowMoreWords() {
    const oldNumMounted = numResultsMounted;
    const newNumMounted = Math.min(numResultsMounted + clampedNumberToShow, results.words.length);

    const newMountedResults = [...mountedResults].fill(true, oldNumMounted, newNumMounted);

    setNumResultsMounted(newNumMounted);
    setMountedResults(newMountedResults);
  }

  return (
    <>
      <Box className={classes.results_words_list_columns}>
        {results.words.map((result, idx) => {
          if (doAnimations) {
            delay = Math.min(
              idx % clampedNumberToShow === 0 ? baseDelay : (delay *= delayMult),
              totalDelay
            );
          }

          if (!mountedResults[idx]) return null;

          return (
            <Box
              key={idx}
              style={{
                animationName: classes.resultReveal,
                animationDuration: `${delay}ms`,
                animationDelay: `${delay}ms`,
                animationFillMode: "both",
              }}
              className={classes.result_list_item}
            >
              {results.defaultHidden ? (
                <ResultChars
                  result={result}
                  permRevealedCharPositions={results.revealedCharPositions}
                />
              ) : (
                <Text>{capitalizeFirstLetter(result)}</Text>
              )}
            </Box>
          );
        })}
        {results.words.length === 0 && (
          <Text classNames={{ root: classes.no_results_text }}>{"No results >.<"}</Text>
        )}
      </Box>
      {numResultsMounted < results.words.length && (
        <Button
          key={numResultsMounted}
          style={{
            animationName: classes.resultReveal,
            animationDuration: `${totalDelay}ms`,
            animationDelay: `${doAnimations ? totalDelay : 200}ms`,
            animationFillMode: "backwards",
          }}
          onClick={handleShowMoreWords}
          rightSection={<IconArrowDown />}
        >
          Show more words
        </Button>
      )}
    </>
  );
}

function ResultChars({
  result,
  permRevealedCharPositions,
}: {
  result: string;
  permRevealedCharPositions: boolean[];
}) {
  const initialArray = new Array<CharRevealState>(result.length);
  for (let i = 0; i < permRevealedCharPositions.length; i++) {
    initialArray[i] = permRevealedCharPositions[i]
      ? CharRevealState.PERM_REVEALED
      : CharRevealState.HIDDEN;
  }
  const [charRevealStates, setCharRevealStates] = useState(initialArray);
  const [allCharsRevealed, setAllCharsRevealed] = useState(
    getAllCharsAreRevealed(charRevealStates)
  );

  function getAllCharsAreRevealed(charRevealStates: CharRevealState[]): boolean {
    for (const charState of charRevealStates) {
      if (charState === CharRevealState.HIDDEN) return false;
    }

    return true;
  }

  function toggleCharRevealed(index: number) {
    const newRevealStates = charRevealStates.map((currentState, i) =>
      i === index ? getNextRevealState(currentState) : currentState
    );
    const allCharsAreRevealed = getAllCharsAreRevealed(newRevealStates);
    setCharRevealStates(newRevealStates);
    setAllCharsRevealed(allCharsAreRevealed);
  }

  function toggleAllCharRevealStates() {
    const nextRevealState = allCharsRevealed ? CharRevealState.HIDDEN : CharRevealState.REVEALED;
    setCharRevealStates(
      charRevealStates.map((currentState) =>
        currentState === CharRevealState.PERM_REVEALED
          ? CharRevealState.PERM_REVEALED
          : nextRevealState
      )
    );
    setAllCharsRevealed(!allCharsRevealed);
  }

  function getNextRevealState(revealState: CharRevealState): CharRevealState {
    if (revealState === CharRevealState.PERM_REVEALED) return revealState;

    return revealState === CharRevealState.REVEALED
      ? CharRevealState.HIDDEN
      : CharRevealState.REVEALED;
  }

  return (
    <Group classNames={{ root: classes.result_chars_group }}>
      {result.split("").map((char, idx) => (
        <RevealableChar
          key={idx}
          char={char.toLocaleUpperCase()}
          index={idx}
          revealState={charRevealStates[idx]}
          toggleCharRevealed={toggleCharRevealed}
        />
      ))}
      <ActionIcon variant="light" onClick={() => toggleAllCharRevealStates()}>
        {allCharsRevealed ? <IconEyeOff /> : <IconEye />}
      </ActionIcon>
    </Group>
  );
}
