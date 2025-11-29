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
import { useEffect, useState } from "react";
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
  numberToShow = Math.min(numberToShow, results.words.length);
  const [numResultsMounted, setNumResultsMounted] = useState(numberToShow);
  const [mountedResults, setMountedResults] = useState<boolean[]>(
    new Array(results.words.length).fill(false)
  );
  const [resetKey, setResetKey] = useState(0);

  const baseDelay = doAnimations ? 20 : 0;
  const delayMult = 1.05 + 1 / Math.max(numberToShow, 1);
  let delay = baseDelay;
  const totalDelay = Math.min(baseDelay * delayMult ** numberToShow, 500);

  // Reset the displayed results
  useEffect(() => {
    delay = baseDelay;
    const initialArray = new Array(results.words.length).fill(false);

    // Force a complete reset by incrementing the reset key
    setResetKey((prev) => prev + 1);
    setMountedResults(initialArray);
    setNumResultsMounted(0);
  }, [triggerUpdate, results.words.length]);

  // Animate first results after a reset
  useEffect(() => {
    // Prevent showing double results after a page reload
    if (numResultsMounted === numberToShow) return;

    handleShowMoreWords();
  }, [resetKey]);

  function handleShowMoreWords() {
    const oldNumMounted = numResultsMounted;
    const newNumMounted = Math.min(
      numResultsMounted + numberToShow,
      results.words.length
    );

    const newMountedResults = [...mountedResults].fill(
      true,
      oldNumMounted,
      newNumMounted
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
                totalDelay
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
                  <ResultChars result={result} />
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
  defaultHidden = true,
}: {
  result: string;
  defaultHidden?: boolean;
}) {
  const [allHidden, setAllHidden] = useState(defaultHidden);
  const [hiddenChars, setHiddenChars] = useState(
    new Array<boolean>(result.length).fill(defaultHidden)
  );

  function updateHiddenChar(index: number, hidden: boolean) {
    hiddenChars[index] = hidden;
    setHiddenChars(
      hiddenChars.map((charState, idx) => (idx === index ? hidden : charState))
    );

    let hiddenCount = hiddenChars.filter((char) => char).length;

    if (hiddenCount === 0 && allHidden) {
      fillHiddenArray(false);
    } else if (hiddenCount === result.length && !allHidden) {
      fillHiddenArray(true);
    }
  }

  function fillHiddenArray(hidden: boolean) {
    setHiddenChars(new Array<boolean>(result.length).fill(hidden));
    setAllHidden(hidden);
  }

  return (
    <Group>
      {result.split("").map((char, idx) => (
        <Text key={idx}>
          <RevealableChar
            char={char.toLocaleUpperCase()}
            index={idx}
            hide={allHidden}
            updateHidden={updateHiddenChar}
          />
        </Text>
      ))}
      <ActionIcon onClick={() => setAllHidden(!allHidden)} variant="light">
        {allHidden ? <IconEye /> : <IconEyeOff />}
      </ActionIcon>
    </Group>
  );
}
