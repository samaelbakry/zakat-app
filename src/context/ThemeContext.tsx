import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  lightColors,
  darkColors,
  type ThemeColors,
} from "@/constants/theme";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  isDarkMode: boolean;
  theme: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  isThemeLoaded: boolean;
}

const THEME_STORAGE_KEY = "zakaty-theme";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    async function loadTheme() {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

        if (savedTheme === "dark" || savedTheme === "light") {
          setThemeState(savedTheme);
        }
      } catch (error) {
        console.error("Failed to load theme:", error);
      } finally {
        setIsThemeLoaded(true);
      }
    }

    loadTheme();
  }, []);

  useEffect(() => {
    if (!isThemeLoaded) return;

    AsyncStorage.setItem(THEME_STORAGE_KEY, theme).catch((error) => {
      console.error("Failed to save theme:", error);
    });
  }, [theme, isThemeLoaded]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  const isDarkMode = theme === "dark";
  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDarkMode,
        colors,
        toggleTheme,
        setTheme,
        isThemeLoaded,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}