import { Box, Button, RollingNumber, Text } from "@mantine/core";
import { IconArrowDown } from "@tabler/icons-react";
import { useState } from "react";
import capitalizeFirstLetter from "@/utils/capitalizeFirstLetter";
import pluralize from "@/utils/pluralize";
import { IResults } from "@/utils/resultBuilder";
import RevealableWord from "./RevealableWord/RevealableWord";
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
                <RevealableWord
                  result={result}
                  initialCharRevealStates={results.initialCharRevealStates}
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
