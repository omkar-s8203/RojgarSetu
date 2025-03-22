import { firestore } from "@/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "@react-native-firebase/firestore";
import { create } from "zustand";

export interface Job {
  id: string;
  title: string;
  description: string;
  skills: string[];
  location: string;
  salary: string;
  employerId: string;
  companyName: string;
  candidates: string[];
}

interface JobsStore {
  jobs: Job[];
  filteredJobs: Job[];
  hasInitialized: boolean;
  selectedSkills: string[];
  selectedLocations: string[];
  searchQuery: string;
  employerJobs: Job[];

  skills: string[];
  locations: string[];

  initialize: () => Promise<void>;
  setFilter: (skills: string[], locations: string[]) => void;
  addJob: (job: Job) => void;
  setSearchQuery: (query: string) => void;
  getEmployerJobs: (employerId: string) => Job[];
  applyToJob: (jobId: string, userId: string) => Promise<void>;
  getJob: (jobId: string) => Job | undefined;
  fetchGlobalSkillsAndLocations: () => Promise<void>;
  updateGlobalSkillsAndLocations: (
    skills: string[],
    location: string
  ) => Promise<void>;
  refresh: () => Promise<void>;
}

export const jobsStore = create<JobsStore>((set, get) => ({
  jobs: [],
  filteredJobs: [],
  hasInitialized: false,
  selectedSkills: [],
  selectedLocations: [],
  searchQuery: "",
  employerJobs: [],
  skills: [],
  locations: [],

  initialize: async () => {
    if (get().hasInitialized) return;

    const snapshot = await getDocs(collection(firestore, "jobs"));
    const jobs = snapshot.docs
      .map((doc) => {
        if (doc.id === "data") return;

        return { id: doc.id, ...doc.data() } as Job;
      })
      .filter(Boolean) as Job[];

    set({ jobs, filteredJobs: jobs, hasInitialized: true });
  },

  setFilter: (skills: string[], locations: string[]) => {
    const { jobs } = get();
    let filtered = [...jobs];

    if (skills.length > 0) {
      filtered = filtered.filter((job) =>
        job.skills.some((skill) => skills.includes(skill))
      );
    }

    if (locations.length > 0) {
      filtered = filtered.filter((job) => locations.includes(job.location));
    }

    set({
      filteredJobs: filtered,
      selectedSkills: skills,
      selectedLocations: locations,
    });
  },

  addJob: (job: Job) => {
    const { jobs } = get();
    const newJob = {
      ...job,
      candidates: [],
    };
    set({
      jobs: [newJob, ...jobs],
      filteredJobs: [newJob, ...jobs],
    });
  },

  setSearchQuery: (query: string) => {
    const { jobs, selectedSkills, selectedLocations } = get();
    set({ searchQuery: query });

    let filtered = [...jobs];

    if (query) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(query.toLowerCase()) ||
          job.description.toLowerCase().includes(query.toLowerCase()) ||
          job.companyName.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (selectedSkills.length > 0) {
      filtered = filtered.filter((job) =>
        job.skills.some((skill) => selectedSkills.includes(skill))
      );
    }

    if (selectedLocations.length > 0) {
      filtered = filtered.filter((job) =>
        selectedLocations.includes(job.location)
      );
    }

    set({ filteredJobs: filtered });
  },

  getEmployerJobs: (employerId: string) => {
    const { jobs } = get();
    return jobs.filter((job) => job.employerId === employerId);
  },

  getJob: (jobId: string) => {
    const { jobs } = get();
    return jobs.find((job) => job.id === jobId);
  },

  applyToJob: async (jobId: string, userId: string) => {
    const { jobs } = get();
    const jobRef = doc(firestore, "jobs", jobId);

    await updateDoc(jobRef, {
      candidates: arrayUnion(userId),
    });

    const updatedJobs = jobs.map((job) => {
      if (job.id === jobId) {
        return {
          ...job,
          candidates: [...(job.candidates || []), userId],
        };
      }
      return job;
    });

    set({ jobs: updatedJobs });
  },

  fetchGlobalSkillsAndLocations: async () => {
    const docRef = await getDoc(doc(firestore, "jobs", "data"));
    if (docRef.exists) {
      const data = docRef.data() as { skills: string[]; locations: string[] };
      set({
        skills: data.skills || [],
        locations: data.locations || [],
      });
    }
  },

  updateGlobalSkillsAndLocations: async (
    newSkills: string[],
    location: string
  ) => {
    const docRef = doc(firestore, "jobs", "data");
    const currentSkills = new Set(get().skills);
    const currentLocations = new Set(get().locations);

    newSkills.forEach((skill) => currentSkills.add(skill));
    currentLocations.add(location);

    await updateDoc(docRef, {
      skills: Array.from(currentSkills),
      locations: Array.from(currentLocations),
    });

    set({
      skills: Array.from(currentSkills),
      locations: Array.from(currentLocations),
    });
  },

  refresh: async () => {
    const snapshot = await getDocs(collection(firestore, "jobs"));
    const jobs = snapshot.docs
      .map((doc) => {
        if (doc.id === "data") return;
        return { id: doc.id, ...doc.data() } as Job;
      })
      .filter(Boolean) as Job[];

    const { selectedSkills, selectedLocations, searchQuery } = get();
    let filtered = [...jobs];

    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSkills.length > 0) {
      filtered = filtered.filter((job) =>
        job.skills.some((skill) => selectedSkills.includes(skill))
      );
    }

    if (selectedLocations.length > 0) {
      filtered = filtered.filter((job) =>
        selectedLocations.includes(job.location)
      );
    }

    set({ jobs, filteredJobs: filtered });
  },
}));
