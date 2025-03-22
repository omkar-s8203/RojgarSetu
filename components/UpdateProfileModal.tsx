import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { jobsStore } from "../store/jobs";
import { userStore } from "../store/user";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function UpdateProfileModal({ visible, onClose }: Props) {
  const {
    skills: globalSkills,
    locations: globalLocations,
    fetchGlobalSkillsAndLocations,
  } = jobsStore();
  const {
    skills: userSkills,
    locations: userLocations,
    updateSkillsAndLocations,
  } = userStore();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");

  useEffect(() => {
    fetchGlobalSkillsAndLocations();
    setSelectedSkills(userSkills);
    setSelectedLocations(userLocations);
  }, [visible]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  };

  const handleSave = async () => {
    await updateSkillsAndLocations(selectedSkills, selectedLocations);
    onClose();
  };

  const filteredSkills = globalSkills.filter((skill) =>
    skill.toLowerCase().includes(skillSearch.toLowerCase())
  );

  const filteredLocations = globalLocations.filter((location) =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Update Profile</Text>

          <Text style={styles.sectionTitle}>Skills</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search skills..."
            value={skillSearch}
            onChangeText={setSkillSearch}
          />
          <ScrollView style={styles.optionsContainer}>
            <View style={styles.optionsGrid}>
              {filteredSkills.map((skill) => (
                <TouchableOpacity
                  key={skill}
                  style={[
                    styles.optionChip,
                    selectedSkills.includes(skill) && styles.selectedOption,
                  ]}
                  onPress={() => toggleSkill(skill)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedSkills.includes(skill) &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {skill}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <Text style={styles.sectionTitle}>Locations</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search locations..."
            value={locationSearch}
            onChangeText={setLocationSearch}
          />
          <ScrollView style={styles.optionsContainer}>
            <View style={styles.optionsGrid}>
              {filteredLocations.map((location) => (
                <TouchableOpacity
                  key={location}
                  style={[
                    styles.optionChip,
                    selectedLocations.includes(location) &&
                      styles.selectedOption,
                  ]}
                  onPress={() => toggleLocation(location)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedLocations.includes(location) &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {location}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
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
    maxHeight: "80%",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  optionsContainer: {
    maxHeight: 200,
    marginBottom: 20,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 4,
  },
  optionChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    minWidth: 80,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  option: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#f0f0f0",
    textAlign: "center",
  },
  selectedOption: {
    backgroundColor: "#4c6ef5",
    borderColor: "#4c6ef5",
  },
  optionText: {
    color: "#333",
  },
  selectedOptionText: {
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  cancelButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    color: "#333",
  },
  saveButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#4c6ef5",
  },
  saveButtonText: {
    color: "white",
  },
});
