import { Skeleton } from "@mantine/core";
import classes from "./AppContentSkeleton.module.css";

export default function AppContentSkeleton() {
  return (
    <>
      <Skeleton classNames={{ root: classes.guess_input_skeleton }} />
      <Skeleton classNames={{ root: classes.find_words_button_skeleton }} />
    </>
  );
}
