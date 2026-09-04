import { Group, ActionIcon } from "@mantine/core";
import { IconEyeOff, IconEye } from "@tabler/icons-react";
import { useState } from "react";
import { CharRevealState } from "@/enums/enums";
import RevealableChar from "../../Buttons/RevealableChar/RevealableChar";
import classes from "./RevealableWord.module.css";

type RevealableWordProps = {
  result: string;
  initialCharRevealStates: CharRevealState[];
};

export default function RevealableWord({ result, initialCharRevealStates }: RevealableWordProps) {
  const upperCaseResult = result.toLocaleUpperCase();
  const [charRevealStates, setCharRevealStates] = useState(initialCharRevealStates);
  const [allCharsRevealed, setAllCharsRevealed] = useState(
    getAllCharsAreRevealed(initialCharRevealStates)
  );

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

  return (
    <Group classNames={{ root: classes.result_chars_group }}>
      {upperCaseResult.split("").map((char, idx) => (
        <RevealableChar
          key={idx}
          char={char}
          index={idx}
          isFirst={idx === 0}
          isLast={idx === upperCaseResult.length - 1}
          revealState={charRevealStates[idx]}
          toggleCharRevealed={toggleCharRevealed}
        />
      ))}
      <ActionIcon
        classNames={{ root: classes.result_chars_reveal_all_button }}
        variant="light"
        onClick={() => toggleAllCharRevealStates()}
      >
        {allCharsRevealed ? <IconEyeOff /> : <IconEye />}
      </ActionIcon>
    </Group>
  );
}

function getAllCharsAreRevealed(charRevealStates: CharRevealState[]): boolean {
  for (const charState of charRevealStates) {
    if (charState === CharRevealState.HIDDEN) return false;
  }

  return true;
}

function getNextRevealState(revealState: CharRevealState): CharRevealState {
  if (revealState === CharRevealState.PERM_REVEALED) return revealState;

  return revealState === CharRevealState.REVEALED
    ? CharRevealState.HIDDEN
    : CharRevealState.REVEALED;
}
