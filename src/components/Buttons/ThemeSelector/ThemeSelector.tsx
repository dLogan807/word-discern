import {
  Switch,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons-react";
import classes from "./ThemeSelector.module.css";

export function ThemeSelector() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("dark", {
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === "dark" ? "light" : "dark");
  };

  const isDarkTheme = computedColorScheme === "dark";
  const tooltipText = `Switch to ${isDarkTheme ? "light" : "dark"} theme`;

  return (
    <Tooltip
      refProp="rootRef"
      label={tooltipText}
      events={{ hover: true, focus: true, touch: false }}
    >
      <Switch
        classNames={{
          trackLabel: classes.colour_theme_switch_track_label,
          track: classes.colour_theme_switch_track,
          thumb: classes.colour_theme_switch_thumb,
        }}
        size="lg"
        aria-label={tooltipText}
        onLabel={<IconMoonStars aria-hidden="true" />}
        offLabel={<IconSun aria-hidden="true" />}
        checked={isDarkTheme}
        onClick={toggleColorScheme}
      />
    </Tooltip>
  );
}
