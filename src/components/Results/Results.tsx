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

export default function Results({ results }: { results: string[] }) {
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
        <ResultChars result={result} />
      </ListItem>
    );
  });

  return (
    <>
      {results.length > 0 ? (
        <Stack
          classNames={{
            root: classes.results_container,
          }}
        >
          <Text>
            {results.length} possible word{results.length == 1 ? "" : "s"}
          </Text>
          <List
            classNames={{
              item: classes.result_list_item,
            }}
          >
            {resultGroups}
          </List>
          {results.length > 5 && (
            <Button onClick={loadMoreResults}>Show more words</Button>
          )}
        </Stack>
      ) : (
        <Text>No results</Text>
      )}
    </>
  );
}

function ResultChars({ result }: { result: string }) {
  const [allRevealed, setAllRevealed] = useState<boolean>(false);
  const [revealedChars, setRevealedChars] = useState<boolean[]>(
    new Array<boolean>(result.length).fill(false)
  );

  function updateRevealedChar(index: number, revealed: boolean) {
    revealedChars[index] = revealed;
    setRevealedChars(
      revealedChars.map((charState, idx) =>
        idx === index ? revealed : charState
      )
    );

    let revealedCount = 0;
    revealedChars.forEach((charRevealed) => {
      if (charRevealed) {
        revealedCount++;
      }
    });

    if (revealedCount === 0 && allRevealed) {
      fillRevealedArray(false);
    } else if (revealedCount === result.length && !allRevealed) {
      fillRevealedArray(true);
    }
  }

  function fillRevealedArray(revealed: boolean) {
    setRevealedChars(new Array<boolean>(result.length).fill(revealed));
    setAllRevealed(revealed);
  }

  return (
    <Group>
      {result.split("").map((char, idx) => (
        <Text key={idx}>
          <RevealableChar
            char={char.toLocaleUpperCase()}
            index={idx}
            reveal={allRevealed}
            updateRevealed={updateRevealedChar}
          />
        </Text>
      ))}
      <ActionIcon onClick={() => setAllRevealed(!allRevealed)} variant="light">
        {allRevealed ? <IconEye /> : <IconEyeOff />}
      </ActionIcon>
    </Group>
  );
}
