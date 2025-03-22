export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const getFirebaseErrorMessage = (error: any): string => {
  const errorCode = error?.code || "";
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "Email is already registered";
    case "auth/invalid-email":
      return "Invalid email format";
    case "auth/user-disabled":
      return "This account has been disabled";
    case "auth/user-not-found":
      return "No account found with this email";
    case "auth/wrong-password":
      return "Incorrect password";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later";
    case "auth/weak-password":
      return "Password should be at least 6 characters";
    default:
      return error?.message || "An error occurred";
  }
};

export const getErrorMessage = (
  field: string,
  value: string,
  firebaseError?: any
): string => {
  if (firebaseError) {
    return getFirebaseErrorMessage(firebaseError);
  }

  switch (field) {
    case "email":
      return !value
        ? "Email is required"
        : !validateEmail(value)
        ? "Invalid email format"
        : "";
    case "password":
      return !value
        ? "Password is required"
        : !validatePassword(value)
        ? "Password must be at least 6 characters"
        : "";
    default:
      return "";
  }
};
