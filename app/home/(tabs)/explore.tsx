import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { userStore } from "@/store/user";
import { jobsStore } from "@/store/jobs";
import NavigationHeader from "@/components/NavigationHeader";
import { colors } from "@/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { auth } from "@/firebase";

export default function Explore() {
  const { role, skills: userSkills, locations: userLocations } = userStore();
  const {
    filteredJobs,
    initialize,
    setFilter,
    selectedSkills,
    selectedLocations,
    setSearchQuery,
    getEmployerJobs,
  } = jobsStore();
  const [employerView, setEmployerView] = useState(false);

  useEffect(() => {
    initialize();
  }, []);

  const toggleSkill = (skill: string) => {
    const newSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter((s) => s !== skill)
      : [...selectedSkills, skill];
    setFilter(newSkills, selectedLocations);
  };

  const toggleLocation = (location: string) => {
    const newLocations = selectedLocations.includes(location)
      ? selectedLocations.filter((l) => l !== location)
      : [...selectedLocations, location];
    setFilter(selectedSkills, newLocations);
  };

  const displayJobs =
    role === "employer" && employerView
      ? getEmployerJobs(auth.currentUser?.uid || "")
      : filteredJobs;

  return (
    <View style={styles.container}>
      <NavigationHeader title="Explore Jobs" showBack={false} />

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs..."
          onChangeText={setSearchQuery}
        />
        {role === "employer" && (
          <TouchableOpacity
            style={[styles.filterChip, employerView && styles.filterChipActive]}
            onPress={() => setEmployerView(!employerView)}
          >
            <Text
              style={[
                styles.filterChipText,
                employerView && styles.filterChipTextActive,
              ]}
            >
              My Jobs
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {role === "employee" && (
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {userSkills.map((skill) => (
              <TouchableOpacity
                key={skill}
                style={[
                  styles.filterChip,
                  selectedSkills.includes(skill) && styles.filterChipActive,
                ]}
                onPress={() => toggleSkill(skill)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedSkills.includes(skill) &&
                      styles.filterChipTextActive,
                  ]}
                >
                  {skill}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.locationFilters}
          >
            {userLocations.map((location) => (
              <TouchableOpacity
                key={location}
                style={[
                  styles.filterChip,
                  selectedLocations.includes(location) &&
                    styles.filterChipActive,
                ]}
                onPress={() => toggleLocation(location)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedLocations.includes(location) &&
                      styles.filterChipTextActive,
                  ]}
                >
                  {location}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <ScrollView style={styles.jobsList}>
        {displayJobs.map((job) => (
          <TouchableOpacity
            key={job.id}
            style={styles.jobCard}
            onPress={() => router.push(`/jobs/view?id=${job.id}`)}
          >
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.companyName}>{job.companyName}</Text>
            <Text style={styles.salary}>{job.salary}</Text>
            <View style={styles.jobTags}>
              <Text style={styles.location}>{job.location}</Text>
              <View style={styles.skillsContainer}>
                {job.skills.map((skill) => (
                  <Text key={skill} style={styles.skill}>
                    {skill}
                  </Text>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {role === "employer" && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/jobs/new")}
        >
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  filtersContainer: {
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  locationFilters: {
    marginTop: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 6,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    color: "#666",
    fontSize: 14,
  },
  filterChipTextActive: {
    color: "white",
  },
  jobsList: {
    padding: 16,
  },
  jobCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  companyName: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  salary: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "500",
    marginTop: 8,
  },
  jobTags: {
    flexDirection: "row",
    marginTop: 12,
    flexWrap: "wrap",
  },
  location: {
    fontSize: 13,
    color: "#666",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skill: {
    fontSize: 13,
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 12,
  },
});
