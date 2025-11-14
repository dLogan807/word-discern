import {
  ActionIcon,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons-react";
import classes from "./ThemeSelector.module.css";

export function ThemeSelector() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("dark");
  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === "dark" ? "light" : "dark");
  };

  const tooltipText =
    computedColorScheme === "light" ? "Light theme" : "Dark theme";

  return (
    <Tooltip label={tooltipText}>
      <ActionIcon
        classNames={{
          root: classes.theme_icon_container,
        }}
        onClick={toggleColorScheme}
        aria-label="Toggle color theme"
      >
        {computedColorScheme === "dark" ? (
          <IconSun aria-label="Sun" className={classes.icon} />
        ) : (
          <IconMoonStars aria-label="Moon and stars" className={classes.icon} />
        )}
      </ActionIcon>
    </Tooltip>
  );
}
