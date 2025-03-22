import { View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { router, SplashScreen } from "expo-router";
import {
  FirebaseAuthTypes,
  onAuthStateChanged,
} from "@react-native-firebase/auth";
import { auth } from "@/firebase";

export default function Index() {
  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }

    prepare();

    onAuthStateChanged(auth, (user: FirebaseAuthTypes.User) => {
      SplashScreen.hideAsync();

      if (!user) {
        router.replace("/auth");
      }

      router.replace("/home");
    });
  }, []);

  return (
    <View>
      <Text>Index</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
