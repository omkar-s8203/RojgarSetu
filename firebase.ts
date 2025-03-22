import { getApp } from "@react-native-firebase/app";
import { getAuth } from "@react-native-firebase/auth";

const app = getApp();

export const auth = getAuth(app);
