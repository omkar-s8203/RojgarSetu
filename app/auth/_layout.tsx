import { colors } from "@/constants/colors";
import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        statusBarStyle: "dark",
        navigationBarColor: colors.backgroundLight,
        statusBarBackgroundColor: colors.backgroundLight,
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
