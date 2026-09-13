import { useContext } from "react";
import { SettingsContext, SettingsContextType } from "@/contexts/SettingsContext";

export function useSettingsContext(): SettingsContextType {
  const context = useContext(SettingsContext);

  if (context === undefined) {
    throw new Error("useSettingsContext must be used within a SettingsProvider");
  }

  return context;
}
