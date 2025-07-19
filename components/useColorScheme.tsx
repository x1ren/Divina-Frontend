import { useColorScheme as _useColorScheme } from "react-native";

/**
 * A custom hook that returns the current color scheme.
 * This can be either 'light' or 'dark'.
 */
export function useColorScheme() {
  return _useColorScheme();
}
