import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import { TextInput } from "../../components/TextInput";
import { router } from "expo-router";

const LoginTab = ({ userType }: { userType: "employee" | "employer" }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleSignIn, loading, errors } = useAuth();

  const onLogin = async () => {
    const user = await handleSignIn(email, password, userType);

    if (user) {
      router.replace("/home");
    }
  };

  return (
    <View style={styles.tabContent}>
      <TextInput
        icon="mail-outline"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        icon="lock-closed-outline"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={onLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}
    </View>
  );
};

const SignupTab = ({ userType }: { userType: "employee" | "employer" }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleSignUp, loading, errors } = useAuth();

  const onSignup = async () => {
    const user = await handleSignUp(fullName, email, password, userType);

    if (user) {
      router.replace("/home");
    }
  };

  return (
    <View style={styles.tabContent}>
      <TextInput
        icon="person-outline"
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        icon="mail-outline"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        icon="lock-closed-outline"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={onSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>
      {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}
    </View>
  );
};

export default function AuthScreen() {
  const [activeTab, setActiveTab] = useState("login");
  const [userType, setUserType] = useState<"employee" | "employer" | null>(
    null
  );
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (userType) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [userType]);

  useEffect(() => {
    const backAction = () => {
      if (userType) {
        setUserType(null);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [userType]);

  if (!userType) {
    return (
      <View
        style={[
          styles.container,
          {
            padding: 20,
          },
        ]}
      >
        <Text style={styles.welcomeText}>Welcome to RojgarSetu</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={styles.roleButton}
            onPress={() => setUserType("employee")}
          >
            <Ionicons name="person-outline" size={32} color="#fff" />
            <Text style={styles.roleText}>I'm an Employee</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.roleButton}
            onPress={() => setUserType("employer")}
          >
            <Ionicons name="business-outline" size={32} color="#fff" />
            <Text style={styles.roleText}>I'm an Employer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "login" && styles.activeTab]}
            onPress={() => setActiveTab("login")}
          >
            <Text style={styles.tabText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "signup" && styles.activeTab]}
            onPress={() => setActiveTab("signup")}
          >
            <Text style={styles.tabText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        {activeTab === "login" ? (
          <LoginTab userType={userType} />
        ) : (
          <SignupTab userType={userType} />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 40,
  },
  roleContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
  },
  roleButton: {
    backgroundColor: "#007AFF",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  roleText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#ddd",
  },
  activeTab: {
    borderBottomColor: "#007AFF",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
  },
  tabContent: {
    gap: 20,
    padding: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -15,
    marginLeft: 5,
  },
});
