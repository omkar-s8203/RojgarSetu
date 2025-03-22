import { View, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { router, SplashScreen } from "expo-router";
import {
  FirebaseAuthTypes,
  onAuthStateChanged,
} from "@react-native-firebase/auth";
import { auth } from "@/firebase";
import { colors } from "@/constants/colors";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Index() {
  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }

    prepare();

    onAuthStateChanged(auth, async (user: FirebaseAuthTypes.User) => {
      SplashScreen.hideAsync();

      const token = await user.getIdToken(true);
      if (!token) {
        if (user) {
          await auth.signOut();
        }

        router.replace("/auth");
        return;
      }

      if (!user) {
        router.replace("/auth");
        return;
      }

      router.replace("/home");
    });
  }, []);

  return (
    <View
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.backgroundLight,
      }}
    >
      <LoadingSpinner size={50} />
    </View>
  );
}
