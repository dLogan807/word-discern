import { MantineProvider, v8CssVariablesResolver } from "@mantine/core";
import { ReactNode } from "react";
import { theme } from "@/theme";
import SettingsProvider from "./SettingsProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <MantineProvider
      theme={theme}
      defaultColorScheme="auto"
      cssVariablesResolver={v8CssVariablesResolver}
    >
      <SettingsProvider>{children}</SettingsProvider>
    </MantineProvider>
  );
}
