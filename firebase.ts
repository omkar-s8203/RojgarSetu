import { getApp } from "@react-native-firebase/app";
import { getAuth } from "@react-native-firebase/auth";
import { getFirestore } from "@react-native-firebase/firestore";
import { userStore } from "./store/user";
import { getMessaging } from "@react-native-firebase/messaging";

const app = getApp();

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const messaging = getMessaging(app);

export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  try {
    userStore.getState().hasInitialized = false;
    await auth.signOut();
  } catch (error) {
    throw error;
  }
};
