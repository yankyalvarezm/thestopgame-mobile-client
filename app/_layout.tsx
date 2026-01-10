import { Stack } from "expo-router";
import "./globals.css";

export default function RootLayout() {
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
      
    </Stack>
  );
}
