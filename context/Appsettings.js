import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import translations from "../context/translation";

const AppSettingsContext = createContext(null);

const THEME_KEY = "@growmaint_theme";
const LANGUAGE_KEY = "@growmaint_language";

export function AppSettingsProvider({ children }) {
  const [theme, setThemeState] = useState("light");
  const [language, setLanguageState] = useState("en");
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);

        if (savedTheme === "light" || savedTheme === "dark") {
          setThemeState(savedTheme);
        }

        if (savedLanguage === "en" || savedLanguage === "es") {
          setLanguageState(savedLanguage);
        }
      } catch (error) {
        console.log("Error loading app settings:", error);
      } finally {
        setLoadingSettings(false);
      }
    };

    loadSettings();
  }, []);

  const setTheme = async (newTheme) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem(THEME_KEY, newTheme);
    } catch (error) {
      console.log("Error saving theme:", error);
    }
  };

  const setLanguage = async (newLanguage) => {
    try {
      setLanguageState(newLanguage);
      await AsyncStorage.setItem(LANGUAGE_KEY, newLanguage);
    } catch (error) {
      console.log("Error saving language:", error);
    }
  };

  const isDark = theme === "dark";
  const isSpanish = language === "es";

  const colors = {
    background: isDark ? "#081023" : "#FFFFFF",
    primaryBackground: isDark ? "#081023" : "#0D1B2A",
    header: isDark ? "#050B18" : "#071426",
    card: isDark ? "#101827" : "#FFFFFF",
    text: isDark ? "#FFFFFF" : "#263238",
    secondaryText: isDark ? "#D9E1EA" : "#5F6B76",
    icon: "#23BDEE",
    border: isDark ? "#293545" : "#E1E5E8",
    input: isDark ? "#172235" : "#F5F7F9",
    chevron: isDark ? "#FFFFFF" : "#0D1B2A",
    inactive: isDark ? "#5D6673" : "#C4C4C4",
    nav: "#25B5D1",
    white: "#FFFFFF",
    black: "#000000",
  };

  const t = translations[language];

  return (
    <AppSettingsContext.Provider
      value={{
        theme,
        language,
        isDark,
        isSpanish,
        colors,
        t,
        setTheme,
        setLanguage,
        loadingSettings,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);

  if (!context) {
    throw new Error(
      "useAppSettings must be used inside AppSettingsProvider"
    );
  }

  return context;
}