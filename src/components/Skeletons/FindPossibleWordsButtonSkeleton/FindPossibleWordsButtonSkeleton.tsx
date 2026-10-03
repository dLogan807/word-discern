import { Skeleton } from "@mantine/core";
import classes from "./FindPossibleWordsButtonSkeleton.module.css";

export default function FindPossibleWordsButtonSkeleton() {
  return <Skeleton classNames={{ root: classes.find_words_button_skeleton }} />;
}
