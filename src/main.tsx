import { MantineProvider, v8CssVariablesResolver } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.tsx";
import { theme } from "@/theme";
import GuessProvider from "./components/Providers/GuessProvider";
import SettingsProvider from "./components/Providers/SettingsProvider";
import WordListProvider from "./components/Providers/WordListProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider
      theme={theme}
      defaultColorScheme="auto"
      cssVariablesResolver={v8CssVariablesResolver}
    >
      <WordListProvider>
        <SettingsProvider>
          <GuessProvider>
            <App />
          </GuessProvider>
        </SettingsProvider>
      </WordListProvider>
    </MantineProvider>
  </React.StrictMode>
);
