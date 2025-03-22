import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { jobsStore } from "@/store/jobs";
import { userStore } from "@/store/user";
import { colors } from "@/constants/colors";
import NavigationHeader from "@/components/NavigationHeader";
import { auth } from "@/firebase";
import CandidateProfileModal from "@/components/CandidateProfileModal";

export default function JobView() {
  const { id } = useLocalSearchParams();
  const job = jobsStore((state) => state.getJob(id as string));
  const { role } = userStore();
  const applyToJob = jobsStore((state) => state.applyToJob);
  const userId = auth.currentUser?.uid;
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
    null
  );
  const addAppliedJob = userStore((state) => state.addAppliedJob);

  if (!job) return null;

  const hasApplied = job.candidates?.includes(userId || "");

  const handleApply = async () => {
    if (!userId || !job) return;
    try {
      await applyToJob(job.id, userId);
      await addAppliedJob(job.id);
      alert("Successfully applied to job!");
    } catch (error) {
      alert("Error applying to job");
    }
  };

  return (
    <View style={styles.container}>
      <NavigationHeader title="Job Details" />

      <ScrollView style={styles.content}>
        <Text style={styles.title}>{job.title}</Text>
        <Text style={styles.company}>{job.companyName}</Text>
        <Text style={styles.salary}>{job.salary}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.location}>{job.location}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Skills</Text>
          <View style={styles.skillsContainer}>
            {job.skills.map((skill) => (
              <Text key={skill} style={styles.skill}>
                {skill}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{job.description}</Text>
        </View>

        {role === "employer" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Candidates</Text>
            {job.candidates.length === 0 ? (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>
                  No candidates yet... 🤔
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  The perfect match is still out there!
                </Text>
              </View>
            ) : (
              <View>
                <Text style={styles.candidatesCount}>
                  {job.candidates.length} application(s)
                </Text>
                {job.candidates.map((candidateId) => (
                  <TouchableOpacity
                    key={candidateId}
                    style={styles.candidateItem}
                    onPress={() => setSelectedCandidate(candidateId)}
                  >
                    <Text style={styles.candidateText}>
                      View Candidate Profile
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {role === "employee" && (
          <TouchableOpacity
            style={[styles.applyButton, hasApplied && styles.appliedButton]}
            onPress={handleApply}
            disabled={hasApplied}
          >
            <Text style={styles.applyButtonText}>
              {hasApplied ? "Applied" : "Apply Now"}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <CandidateProfileModal
        visible={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        candidateId={selectedCandidate || ""}
      />
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
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  company: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  salary: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: "600",
    marginTop: 8,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  location: {
    fontSize: 15,
    color: "#666",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skill: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: "#444",
    lineHeight: 24,
  },
  candidatesCount: {
    fontSize: 15,
    color: "#666",
  },
  applyButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 32,
    marginBottom: 40,
  },
  appliedButton: {
    backgroundColor: "#ccc",
  },
  applyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyStateContainer: {
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  candidateItem: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  candidateText: {
    color: "#4c6ef5",
    fontSize: 15,
    fontWeight: "500",
  },
});
