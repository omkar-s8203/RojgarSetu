import React, { useEffect, useState } from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import { doc, getDoc } from "@react-native-firebase/firestore";
import { firestore } from "@/firebase";

interface Props {
  visible: boolean;
  onClose: () => void;
  candidateId: string;
}

interface CandidateProfile {
  name: string;
  email: string;
  skills: string[];
  locations: string[];
}

export default function CandidateProfileModal({
  visible,
  onClose,
  candidateId,
}: Props) {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const docRef = doc(firestore, "users", candidateId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists) {
        setProfile(docSnap.data() as CandidateProfile);
      }
    };

    if (visible && candidateId) {
      fetchProfile();
    }
  }, [visible, candidateId]);

  if (!profile) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Candidate Profile</Text>

          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {profile.name.charAt(0).toUpperCase()}
              </Text>
            </View>

            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.email}>{profile.email}</Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <Text style={styles.sectionContent}>
                {profile.skills.join(", ") || "No skills listed"}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preferred Locations</Text>
              <Text style={styles.sectionContent}>
                {profile.locations.join(", ") || "No locations listed"}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  content: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  profileInfo: {
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4c6ef5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    color: "white",
    fontWeight: "600",
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  section: {
    width: "100%",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 15,
    color: "#444",
  },
  closeButton: {
    backgroundColor: "#4c6ef5",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
