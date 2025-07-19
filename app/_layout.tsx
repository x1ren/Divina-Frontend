import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useEffect } from "react";
import "react-native-reanimated";
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import React from 'react';

import { useColorScheme } from "../components/useColorScheme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Text as RNText, TextProps } from 'react-native';

export {
  
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  
  initialRouteName: "(tabs)",
};


SplashScreen.preventAutoHideAsync();

export function AppText(props: TextProps) {
  return <RNText {...props} style={[{ fontFamily: 'Inter_400Regular' }, props.style]} />;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  React.useEffect(() => {
    if (error) throw error;
  }, [error]);

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </ThemeProvider>
  );
}
