import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { colors } from "@/constants/colors";
import NavigationHeader from "@/components/NavigationHeader";
import { firestore, auth } from "@/firebase";
import { addDoc, collection } from "@react-native-firebase/firestore";
import { userStore } from "@/store/user";
import { jobsStore } from "@/store/jobs";

export default function NewJob() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const { name: companyName } = userStore();

  const handleSubmit = async () => {
    if (!title || !description || !salary || !location || !skills) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const skillsArray = skills.split(",").map((s) => s.trim());

      // Update global skills and locations
      await jobsStore
        .getState()
        .updateGlobalSkillsAndLocations(skillsArray, location.trim());

      const docRef = await addDoc(collection(firestore, "jobs"), {
        title,
        description,
        salary,
        location: location.trim(),
        skills: skillsArray,
        employerId: auth.currentUser?.uid,
        companyName,
        createdAt: new Date().toISOString(),
        candidates: [],
      });

      jobsStore.getState().addJob({
        id: docRef.id,
        title,
        description,
        salary,
        location: location.trim(),
        skills: skillsArray,
        employerId: auth.currentUser?.uid || "",
        companyName,
        candidates: [],
      });

      router.back();
    } catch (error) {
      alert("Error creating job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <NavigationHeader title="Post New Job" />

      <ScrollView style={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Job Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Senior React Native Developer"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Job description and requirements..."
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Salary</Text>
          <TextInput
            style={styles.input}
            value={salary}
            onChangeText={setSalary}
            onFocus={() => {
              if (!salary.startsWith("₹")) {
                setSalary("₹" + salary);
              }
            }}
            onBlur={() => {
              if (salary.trim() === "₹") {
                setSalary("");
              }
            }}
            placeholder="e.g. ₹80,000 - ₹1,20,000"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. Mumbai, Pune, Bangalore"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Required Skills</Text>
          <TextInput
            style={styles.input}
            value={skills}
            onChangeText={setSkills}
            placeholder="e.g. React Native, TypeScript, Firebase"
          />
          <Text style={styles.hint}>Separate skills with commas</Text>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? "Creating..." : "Create Job"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  content: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e1e1e1",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  hint: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
