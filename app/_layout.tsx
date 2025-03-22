import { colors } from "@/constants/colors";
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.backgroundLight,
        statusBarBackgroundColor: colors.backgroundLight,
        statusBarStyle: "dark",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="home" />
    </Stack>
  );
}
