import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface NavigationHeaderProps {
  title: string;
  showBack?: boolean;
}

export default function NavigationHeader({
  title,
  showBack = true,
}: NavigationHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
      <View style={styles.rightContainer} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 64,
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  leftContainer: {
    width: 72,
    justifyContent: "center",
  },
  rightContainer: {
    width: 72,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    marginLeft: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
  },
});
