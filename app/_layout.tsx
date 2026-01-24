import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import {
  Roboto_100Thin,
  Roboto_300Light,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { Sarala_400Regular, Sarala_700Bold } from "@expo-google-fonts/sarala";
import "./globals.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Roboto_100Thin,
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_700Bold,
    Sarala_400Regular,
    Sarala_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false, title: "Home" }}
      />
      <Stack.Screen
        name="gameModes"
        options={{ headerShown: false, title: "Game Modes" }}
      />
      <Stack.Screen
        name="categories"
        options={{ headerShown: false, title: "Categories" }}
      />
      <Stack.Screen
        name="Login"
        options={{ headerShown: false, title: "Login" }}
      />
      <Stack.Screen
        name="SignUp"
        options={{ headerShown: false, title: "Login" }}
      />
      <Stack.Screen
        name="setupsolo"
        options={{ headerShown: false, title: "Setup Solo" }}
      />
      <Stack.Screen
        name="gameplay"
        options={{ headerShown: false, title: "Game Play" }}
      />
    </Stack>
  );
}
