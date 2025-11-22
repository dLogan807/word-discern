import {
  ActionIcon,
  Button,
  Group,
  List,
  ListItem,
  Stack,
  Text,
  Transition,
} from "@mantine/core";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import RevealableChar from "@/components/Results/RevealableChar/RevealableChar";
import classes from "./Results.module.css";
import { IResults } from "@/utils/resultBuilder";

export default function Results({
  results,
  triggerUpdate,
}: {
  results: IResults;
  triggerUpdate: number;
}) {
  const numberToShow: number = Math.min(10, results.words.length);
  const [numResultsMounted, setNumResultsMounted] = useState(numberToShow);
  const [mountedResults, setMountedResults] = useState<Array<boolean>>([]);
  const [resetKey, setResetKey] = useState(0);

  const baseDelay = 20;
  const delayMult = 1.3;
  let delay = baseDelay;

  // Reset the sdisplayed results
  useEffect(() => {
    delay = baseDelay;
    const currentNumberToShow = Math.min(10, results.words.length);
    const initialArray = new Array(results.words.length).fill(false);
    initialArray.fill(true, 0, currentNumberToShow);

    // Force a complete reset by incrementing the reset key
    setResetKey((prev) => prev + 1);
    setMountedResults([...initialArray]);
    setNumResultsMounted(currentNumberToShow);
  }, [triggerUpdate, results.words.length]);

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
        {numberToShow > 0 ? (
          <>
            <Text>
              {results.words.length} possible word
              {results.words.length == 1 ? "" : "s"}:
            </Text>
            <List
              classNames={{
                item: classes.result_list_item,
              }}
            >
              {results.words.map((result, idx) => {
                delay =
                  idx % numberToShow === 0 ? baseDelay : (delay *= delayMult);

                return (
                  <Transition
                    mounted={mountedResults[idx] ?? false}
                    transition="fade-down"
                    enterDelay={delay}
                    key={`${result}-${idx}-${resetKey}`}
                  >
                    {(transitionStyle) => (
                      <ListItem style={{ ...transitionStyle, zIndex: 1 }}>
                        {results.defaultHidden ? (
                          <ResultChars result={result} />
                        ) : (
                          <Text>{result}</Text>
                        )}
                      </ListItem>
                    )}
                  </Transition>
                );
              })}
            </List>
            {numResultsMounted < results.words.length && (
              <Button onClick={() => handleShowMoreWords()}>
                Show more words
              </Button>
            )}
          </>
        ) : (
          <Text>No results :(</Text>
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
  const [allHidden, setAllHidden] = useState<boolean>(defaultHidden);
  const [hiddenChars, setHiddenChars] = useState<boolean[]>(
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
