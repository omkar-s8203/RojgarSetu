import React, { useState, useRef } from "react";
import {
  View,
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CustomTextInputProps extends TextInputProps {
  icon: keyof typeof Ionicons.glyphMap;
}

export const TextInput = ({ icon, style, ...props }: CustomTextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<RNTextInput>(null);

  return (
    <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
      <View style={[styles.container, isFocused && styles.focused]}>
        <Ionicons
          pointerEvents="none"
          name={icon}
          size={24}
          color={isFocused ? "#007AFF" : "#666"}
        />
        <RNTextInput
          ref={inputRef}
          style={[styles.input, style]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#666"
          {...props}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  focused: {
    borderColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
});
