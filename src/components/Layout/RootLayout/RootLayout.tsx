import { Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ReactNode } from "react";
import Settings from "@/components/Settings/Settings";
import { useSettingsContext } from "@/hooks/useSettingsContext";
import Header from "../Header/Header";
import classes from "./RootLayout.module.css";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const { doAnimations } = useSettingsContext();

  const [settingsOpened, { toggle }] = useDisclosure(false);

  return (
    <Box
      className={`${classes.layout}
            ${!settingsOpened ? classes.layout_settings_pane_closed : undefined}
            ${!doAnimations ? classes.no_animation : undefined}
          `}
    >
      <Header settingsOpened={settingsOpened} toggleSettingsOpened={toggle} />

      <Box
        className={`${classes.settings_pane}
            ${!settingsOpened ? classes.settings_pane_closed : undefined}
            ${!doAnimations ? classes.no_animation : undefined}`}
      >
        <Settings />
      </Box>

      <Box className={classes.content_body}>{children}</Box>
    </Box>
  );
}
