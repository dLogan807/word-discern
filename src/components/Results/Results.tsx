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
import RevealableChar from "./RevealableChar";
import classes from "./Results.module.css";

export default function Results({
  results,
  defaultHidden = true,
}: {
  results: string[];
  defaultHidden?: boolean;
}) {
  const [trimmedResults, setTrimmedResults] = useState<string[]>(
    results.slice(0, 5)
  );
  useEffect(() => {
    setTrimmedResults(results.slice(0, 5));
  }, [results]);

  function loadMoreResults() {
    setTrimmedResults(results.slice(0, trimmedResults.length + 5));
  }

  const resultGroups = trimmedResults.map((result) => {
    return (
      <ListItem key={result}>
        <ResultChars result={result} defaultHidden={defaultHidden} />
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
        {results.length > 0 ? (
          <>
            <Text>
              {results.length} possible word{results.length == 1 ? "" : "s"}:
            </Text>
            <List
              classNames={{
                item: classes.result_list_item,
              }}
            >
              {resultGroups}
            </List>
            {results.length > 5 && trimmedResults.length < results.length && (
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
  const [revealedChars, setHiddenChars] = useState<boolean[]>(
    new Array<boolean>(result.length).fill(defaultHidden)
  );

  useEffect(() => {
    setAllHidden(defaultHidden);
    setHiddenChars(new Array<boolean>(result.length).fill(defaultHidden));
  }, [defaultHidden, result]);

  function updateHiddenChar(index: number, hidden: boolean) {
    revealedChars[index] = hidden;
    setHiddenChars(
      revealedChars.map((charState, idx) =>
        idx === index ? hidden : charState
      )
    );

    let revealedCount = 0;
    for (const revealedChar of revealedChars) {
      if (revealedChar) {
        revealedCount++;
      }
    }

    if (revealedCount === 0 && allHidden) {
      fillHiddenArray(false);
    } else if (revealedCount === result.length && !allHidden) {
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
