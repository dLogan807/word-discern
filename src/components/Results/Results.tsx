import {
  ActionIcon,
  Button,
  Group,
  List,
  ListItem,
  Stack,
  Text,
} from "@mantine/core";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useState } from "react";
import RevealableChar from "@/components/Results/RevealableChar/RevealableChar";
import classes from "./Results.module.css";
import { IResults } from "@/utils/resultBuilder";
import capitalizeFirstLetter from "@/utils/capitalizeFirstLetter";

export default function Results({
  results,
  numberToShow,
  triggerUpdate,
  doAnimations,
}: {
  results: IResults;
  numberToShow: number;
  triggerUpdate: number;
  doAnimations: boolean;
}) {
  const resetKey = `${triggerUpdate}-${results.words.length}`;
  return (
    <ResultsContent
      key={resetKey}
      results={results}
      numberToShow={numberToShow}
      doAnimations={doAnimations}
    />
  );
}

function ResultsContent({
  results,
  numberToShow,
  doAnimations,
}: {
  results: IResults;
  numberToShow: number;
  doAnimations: boolean;
}) {
  numberToShow = Math.min(numberToShow, results.words.length);
  const [numResultsMounted, setNumResultsMounted] = useState(numberToShow);
  const [mountedResults, setMountedResults] = useState<boolean[]>(
    new Array(results.words.length)
      .fill(false)
      .map((_mounted, idx) => idx < numberToShow),
  );

  const baseDelay = doAnimations ? 20 : 0;
  const delayMult = 1.05 + 1 / Math.max(numberToShow, 1);
  let delay = baseDelay;
  const totalDelay = Math.min(baseDelay * delayMult ** numberToShow, 500);

  function handleShowMoreWords() {
    const oldNumMounted = numResultsMounted;
    const newNumMounted = Math.min(
      numResultsMounted + numberToShow,
      results.words.length,
    );

    const newMountedResults = [...mountedResults].fill(
      true,
      oldNumMounted,
      newNumMounted,
    );

    setNumResultsMounted(newNumMounted);
    setMountedResults(newMountedResults);
  }

  return (
    <>
      <Stack
        classNames={{
          root: classes.results_container,
        }}
      >
        <Text>
          {numberToShow > 0
            ? `${results.words.length} possible word${
                results.words.length == 1 ? "" : "s"
              }:`
            : "No results :("}
        </Text>
        <List
          type="ordered"
          classNames={{
            item: classes.result_list_item,
          }}
        >
          {results.words.map((result, idx) => {
            if (doAnimations) {
              delay = Math.min(
                idx % numberToShow === 0 ? baseDelay : (delay *= delayMult),
                totalDelay,
              );
            }

            if (!mountedResults[idx]) return null;

            return (
              <ListItem
                key={idx}
                style={{
                  animationName: classes.resultReveal,
                  animationDuration: `${delay}ms`,
                  animationDelay: `${delay}ms`,
                  animationFillMode: "both",
                }}
              >
                {results.defaultHidden ? (
                  <ResultChars
                    result={result}
                    permRevealedCharPositions={results.revealedCharPositions}
                  />
                ) : (
                  <Text>{capitalizeFirstLetter(result)}</Text>
                )}
              </ListItem>
            );
          })}
        </List>
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
          >
            Show more words
          </Button>
        )}
      </Stack>
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
  const defaultArray = new Array<boolean>(result.length).fill(true);
  const numToggleable = permRevealedCharPositions.filter(
    (charIsRevealed) => !charIsRevealed,
  ).length;

  const [allRevealed, setAllRevealed] = useState(false);
  const [revealedChars, setRevealedChars] = useState(defaultArray);

  function updateHiddenChar(index: number, hidden: boolean) {
    revealedChars[index] = hidden;
    setRevealedChars(
      revealedChars.map((charState, i) => (i === index ? hidden : charState)),
    );

    const numToggleableRevealed = revealedChars.filter(
      (charIsRevealed) => !charIsRevealed,
    ).length;

    if (numToggleableRevealed === 0 && allRevealed) {
      fillRevealedArray(true);
    } else if (numToggleableRevealed === numToggleable && !allRevealed) {
      fillRevealedArray(false);
    }
  }

  function fillRevealedArray(revealed: boolean) {
    setRevealedChars(
      new Array<boolean>(result.length).map((_hidden, i) =>
        permRevealedCharPositions[i] ? true : revealed,
      ),
    );
    setAllRevealed(revealed);
  }

  return (
    <Group>
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
