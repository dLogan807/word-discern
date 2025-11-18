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

export default function Results({
  results,
  defaultHidden = true,
}: {
  results: IResults;
  defaultHidden?: boolean;
}) {
  const numberToShow = 7;
  const [trimmedResults, setTrimmedResults] = useState<string[]>(
    results.words.slice(0, numberToShow)
  );
  useEffect(() => {
    setTrimmedResults(results.words.slice(0, numberToShow));
  }, [results]);

  function loadMoreResults() {
    setTrimmedResults(
      results.words.slice(0, trimmedResults.length + numberToShow)
    );
  }

  const resultGroups = trimmedResults.map((result) => {
    return (
      <ListItem key={result}>
        {defaultHidden ? (
          <ResultChars result={result} />
        ) : (
          <Text>{result}</Text>
        )}
      </ListItem>
    );
  });

  return (
    <>
      <Stack
        classNames={{
          root: classes.results_container,
        }}
      >
        {results.words.length > 0 ? (
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
              {resultGroups}
            </List>
            {results.words.length > 5 &&
              trimmedResults.length < results.words.length && (
                <Button onClick={loadMoreResults}>Show more words</Button>
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
