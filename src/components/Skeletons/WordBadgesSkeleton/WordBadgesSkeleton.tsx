import { Skeleton } from "@mantine/core";
import classes from "./WordBadgesSkeleton.module.css";

export default function WordBadgesSkeleton() {
  return (
    <>
      <Skeleton classNames={{ root: classes.badge_skeleton }} />
      <Skeleton classNames={{ root: classes.badge_skeleton }} />
    </>
  );
}
