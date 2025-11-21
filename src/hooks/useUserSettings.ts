import { useState, useEffect } from "react";

export interface UserSettings {
  showAiScheduleSuggestion: boolean;
}

const defaultSettings: UserSettings = {
  showAiScheduleSuggestion: false,
};

export const useUserSettings = () => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  useEffect(() => {
    const stored = localStorage.getItem("userSettings");
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse user settings", e);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem("userSettings", JSON.stringify(updated));
  };

  return { settings, updateSettings };
};
