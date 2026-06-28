import { ActionIcon, createTheme } from "@mantine/core";
import classes from "./theme.module.css";

export const theme = createTheme({
  primaryColor: "discerning-purple",
  colors: {
    "discerning-purple": [
      "#faedff",
      "#ecdaf7",
      "#d3b3e9",
      "#ba8ada",
      "#a262cc",
      "#9851c6",
      "#9145c4",
      "#7e37ad",
      "#702f9b",
      "#622689",
    ],
  },
  fontFamily: "Arial, sans-serif",
  headings: { fontFamily: "Times New Roman, sans-serif" },
  components: {
    ActionIcon: ActionIcon.extend({
      classNames: {
        root: classes.action_icon,
        icon: classes.action_icon_icon,
      },
    }),
  },
});
