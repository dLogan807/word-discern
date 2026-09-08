import { MantineProvider, v8CssVariablesResolver } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.tsx";
import { theme } from "@/theme";
import SettingsProvider from "./components/Providers/SettingsProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider
      theme={theme}
      defaultColorScheme="auto"
      cssVariablesResolver={v8CssVariablesResolver}
    >
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </MantineProvider>
  </React.StrictMode>
);
