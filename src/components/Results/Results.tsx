import { Box, Button, RollingNumber, Text } from "@mantine/core";
import { IconArrowDown } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { CharRevealState } from "@/enums/enums";
import capitalizeFirstLetter from "@/utils/capitalizeFirstLetter";
import pluralize from "@/utils/pluralize";
import { IResults } from "@/utils/resultBuilder";
import RevealableWord from "./RevealableWord/RevealableWord";
import classes from "./Results.module.css";

type ResultsProps = {
  results: IResults;
  resultsUpdateKey: number;
  numberToShow: number;
  doAnimations: boolean;
};

export default function Results({
  results,
  resultsUpdateKey,
  numberToShow,
  doAnimations,
}: ResultsProps) {
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
  const actualNumberToShow = Math.min(numberToShow, results.words.length);
  const isSoleFullyRevealedResult = soleFullyRevealedResult(results);

  const [numResultsMounted, setNumResultsMounted] = useState(actualNumberToShow);

  function handleShowMoreWords() {
    setNumResultsMounted((prev) => Math.min(prev + actualNumberToShow, results.words.length));
  }

  const animationDelays = useMemo(() => {
    if (!doAnimations) return [];

    return Array.from({ length: actualNumberToShow }, (_, i) =>
      calculateAnimationDelay(i, actualNumberToShow)
    );
  }, [doAnimations, actualNumberToShow]);

  const maxAnimationDelay =
    animationDelays.length > 0 ? animationDelays[animationDelays.length - 1] : 0;
  const animationDuration = doAnimations ? 50 : 0;

  return (
    <>
      <Box className={classes.results_words_list_columns}>
        {results.words.slice(0, numResultsMounted).map((result, idx) => {
          const modOfShownIdx = idx % actualNumberToShow;

          const animationDelay = animationDelays.length > 0 ? animationDelays[modOfShownIdx] : 0;

          return (
            <Box
              key={idx}
              style={{
                animationName: classes.resultReveal,
                animationDuration: `${animationDuration}ms`,
                animationDelay: `${animationDelay}ms`,
                animationFillMode: "both",
              }}
              className={classes.result_list_item}
            >
              {results.defaultHidden && !isSoleFullyRevealedResult ? (
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
          classNames={{ root: classes.show_more_results_button }}
          key={numResultsMounted}
          style={{
            animationName: classes.resultReveal,
            animationDuration: `${animationDuration}ms`,
            animationDelay: `${maxAnimationDelay}ms`,
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

function calculateAnimationDelay(x: number, actualNumberToShow: number) {
  const gradient = 100;
  const y = gradient * actualNumberToShow ** (x / (x + actualNumberToShow));

  return y;
}

function soleFullyRevealedResult(results: IResults): boolean {
  if (results.words.length > 1) return false;

  for (const charState of results.initialCharRevealStates) {
    if (charState !== CharRevealState.PERM_REVEALED) return false;
  }

  return true;
}
