import { Switch, Tooltip, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons-react";
import classes from "./ThemeSelector.module.css";

export function ThemeSelector() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("dark");
  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === "dark" ? "light" : "dark");
  };

  const isDarkTheme = computedColorScheme === "dark";
  const tooltipText = `Switch to ${isDarkTheme ? "light theme" : "dark theme"}`;

  return (
    <Tooltip refProp="rootRef" label={tooltipText}>
      <Switch
        classNames={{
          trackLabel: classes.colour_theme_switch_track_label,
          track: classes.colour_theme_switch_track,
          thumb: classes.colour_theme_switch_thumb,
        }}
        size="lg"
        aria-label="Toggle colour theme"
        onLabel={<IconMoonStars aria-label="Moon and stars" />}
        offLabel={<IconSun aria-label="Sun" />}
        checked={isDarkTheme}
        onClick={toggleColorScheme}
      />
    </Tooltip>
  );
}
