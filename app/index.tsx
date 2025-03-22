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
import { userStore } from "@/store/user";

export default function Index() {
  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }

    prepare();

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user: FirebaseAuthTypes.User) => {
        SplashScreen.hideAsync();

        if (!user) {
          router.replace("/auth");
        }

        try {
          const token = await user.getIdToken(true);
          if (!token) {
            if (user) await auth.signOut();

            router.replace("/auth");
          }

          if (!userStore.getState().hasInitialized)
            await userStore.getState().initialize();

          router.replace("/home");
        } catch (error) {
          router.replace("/auth");
        }
      }
    );

    return () => {
      unsubscribe();
    };
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
