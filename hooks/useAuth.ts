import { useState } from "react";
import { signIn, signUp, signOut, firestore } from "../firebase";
import {
  validateEmail,
  validatePassword,
  getErrorMessage,
  getFirebaseErrorMessage,
} from "../utils/validation";
import { doc, setDoc } from "@react-native-firebase/firestore";

interface AuthError {
  email?: string;
  password?: string;
  general?: string;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<AuthError>({});

  const handleSignUp = async (
    name: string,
    email: string,
    password: string,
    role: "employee" | "employer" = "employee"
  ) => {
    setErrors({});

    if (!validateEmail(email) || !validatePassword(password)) {
      setErrors({
        email: getErrorMessage("email", email),
        password: getErrorMessage("password", password),
      });
      return null;
    }

    setLoading(true);
    try {
      const user = await signUp(email, password);
      const docRef = doc(firestore, "users", user.uid);
      await setDoc(docRef, {
        name,
        email,
        role,
        skills: [],
        locations: [],
      });

      setLoading(false);
      return user;
    } catch (error: any) {
      setLoading(false);
      const errorMessage = getFirebaseErrorMessage(error);
      setErrors({
        general: errorMessage,
        email: error.code === "auth/email-already-in-use" ? errorMessage : "",
        password: error.code === "auth/weak-password" ? errorMessage : "",
      });
      return null;
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    setErrors({});

    if (!validateEmail(email) || !validatePassword(password)) {
      setErrors({
        email: getErrorMessage("email", email),
        password: getErrorMessage("password", password),
      });
      return null;
    }

    setLoading(true);
    try {
      const user = await signIn(email, password);
      setLoading(false);
      return user;
    } catch (error: any) {
      setLoading(false);
      const errorMessage = getFirebaseErrorMessage(error);
      setErrors({
        general: errorMessage,
        email: error.code === "auth/user-not-found" ? errorMessage : "",
        password: error.code === "auth/wrong-password" ? errorMessage : "",
      });
      return null;
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setErrors({ general: getFirebaseErrorMessage(error) });
    }
  };

  return {
    loading,
    errors,
    handleSignUp,
    handleSignIn,
    handleSignOut,
  };
};
