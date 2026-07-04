import { ActionIcon, Box, Button, Group, RollingNumber, Text } from "@mantine/core";
import { IconArrowDown, IconEye, IconEyeOff } from "@tabler/icons-react";
import { useState } from "react";
import RevealableChar from "@/components/Results/RevealableChar/RevealableChar";
import capitalizeFirstLetter from "@/utils/capitalizeFirstLetter";
import pluralize from "@/utils/pluralize";
import { IResults } from "@/utils/resultBuilder";
import classes from "./Results.module.css";

export default function Results({
  results,
  numberToShow,
  doAnimations,
}: {
  results: IResults;
  numberToShow: number;
  doAnimations: boolean;
}) {
  const clampedNumberToShow = Math.min(numberToShow, results.words.length);
  const [numResultsMounted, setNumResultsMounted] = useState(clampedNumberToShow);
  const [mountedResults, setMountedResults] = useState<boolean[]>(
    new Array(results.words.length).fill(false).map((_mounted, idx) => idx < clampedNumberToShow)
  );

  const baseDelay = doAnimations ? 20 : 0;
  const delayMult = 1.05 + 1 / Math.max(clampedNumberToShow, 1);
  let delay = baseDelay;
  const totalDelay = Math.min(baseDelay * delayMult ** clampedNumberToShow, 500);

  function handleShowMoreWords() {
    const oldNumMounted = numResultsMounted;
    const newNumMounted = Math.min(numResultsMounted + clampedNumberToShow, results.words.length);

    const newMountedResults = [...mountedResults].fill(true, oldNumMounted, newNumMounted);

    setNumResultsMounted(newNumMounted);
    setMountedResults(newMountedResults);
  }

  return (
    <Box className={classes.results_container}>
      <Box className={classes.results_text_container}>
        <Text classNames={{ root: classes.results_text }}>
          {clampedNumberToShow > 0 ? (
            <>
              <RollingNumber
                value={results.words.length}
                fz="36px"
                classNames={{ root: classes.results_text_number }}
              />

              {` possible ${pluralize(results.words.length, "word")}`}
            </>
          ) : (
            "No results >.<"
          )}
        </Text>
      </Box>

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
    </Box>
  );
}

function ResultChars({
  result,
  permRevealedCharPositions,
}: {
  result: string;
  permRevealedCharPositions: boolean[];
}) {
  const defaultArray = new Array<boolean>(result.length).fill(true);
  const numToggleable = permRevealedCharPositions.filter(
    (charIsRevealed) => !charIsRevealed
  ).length;

  const [allRevealed, setAllRevealed] = useState(false);
  const [revealedChars, setRevealedChars] = useState(defaultArray);

  function updateHiddenChar(index: number, hidden: boolean) {
    revealedChars[index] = hidden;
    setRevealedChars(revealedChars.map((charState, i) => (i === index ? hidden : charState)));

    const numToggleableRevealed = revealedChars.filter((charIsRevealed) => !charIsRevealed).length;

    if (numToggleableRevealed === 0 && allRevealed) {
      fillRevealedArray(true);
    } else if (numToggleableRevealed === numToggleable && !allRevealed) {
      fillRevealedArray(false);
    }
  }

  function fillRevealedArray(revealed: boolean) {
    setRevealedChars(
      new Array<boolean>(result.length).map((_hidden, i) =>
        permRevealedCharPositions[i] ? true : revealed
      )
    );
    setAllRevealed(revealed);
  }

  return (
    <Group classNames={{ root: classes.result_chars_group }}>
      {result.split("").map((char, idx) => (
        <Text key={idx}>
          {permRevealedCharPositions[idx] ? (
            char.toLocaleUpperCase()
          ) : (
            <RevealableChar
              key={`${idx}-${allRevealed ? "1" : "0"}`}
              char={char.toLocaleUpperCase()}
              index={idx}
              reveal={allRevealed}
              updateRevealed={updateHiddenChar}
            />
          )}
        </Text>
      ))}
      <ActionIcon onClick={() => setAllRevealed(!allRevealed)} variant="light">
        {allRevealed ? <IconEyeOff /> : <IconEye />}
      </ActionIcon>
    </Group>
  );
}
