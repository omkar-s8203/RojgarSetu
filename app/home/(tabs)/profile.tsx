import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { userStore } from "../../../store/user";
import { useAuth } from "../../../hooks/useAuth";
import NavigationHeader from "../../../components/NavigationHeader";
import UpdateProfileModal from "../../../components/UpdateProfileModal";

export default function Profile() {
  const router = useRouter();
  const { name, email, role, skills, locations } = userStore();
  const { handleSignOut } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onLogout = async () => {
    await handleSignOut();
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <NavigationHeader title="Profile" showBack={false} />
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.nameText}>{name}</Text>
            <Text style={styles.roleText}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoSection}>
            <View style={styles.section}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{email}</Text>
            </View>

            {role === "employee" && (
              <>
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.label}>Skills</Text>
                    <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                      <Text style={styles.editButton}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.value}>
                    {skills.join(", ") || "No skills added"}
                  </Text>
                </View>

                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.label}>Preferred Locations</Text>
                    <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                      <Text style={styles.editButton}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.value}>
                    {locations.join(", ") || "No locations added"}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      <UpdateProfileModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
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
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  avatarContainer: {
    alignItems: "center",
    padding: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4c6ef5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    color: "white",
    fontWeight: "600",
  },
  nameText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  roleText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.06)",
    marginHorizontal: 24,
  },
  infoSection: {
    padding: 24,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
    fontWeight: "500",
  },
  value: {
    fontSize: 16,
    color: "#1a1a1a",
    lineHeight: 22,
  },
  logoutButton: {
    backgroundColor: "#ff4757",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#ff4757",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  editButton: {
    color: "#4c6ef5",
    fontSize: 14,
    fontWeight: "500",
  },
});
