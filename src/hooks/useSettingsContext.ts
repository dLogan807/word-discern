import { useContext } from "react";
import { SettingsContext, SettingsContextType } from "@/components/Providers/SettingsProvider";

export function useSettingsContext(): SettingsContextType {
  const context = useContext(SettingsContext);

  if (context === undefined) {
    throw new Error("useSettingsContext must be used within a SettingsProvider");
  }

  return context;
}
