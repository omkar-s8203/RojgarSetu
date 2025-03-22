import { auth, firestore } from "@/firebase";
import { doc, getDoc, updateDoc } from "@react-native-firebase/firestore";
import { create } from "zustand";

export interface UserStore {
  name: string;
  email: string;
  role: "employee" | "employer";
  skills: string[];
  locations: string[];

  hasInitialized: boolean;
  initialize: () => Promise<void>;
  updateSkillsAndLocations: (
    skills: string[],
    locations: string[]
  ) => Promise<void>;
}

export const userStore = create<UserStore>((set) => ({
  name: "",
  email: "",
  role: "employee",
  skills: [],
  locations: [],

  hasInitialized: false,
  initialize: async () => {
    if (!auth.currentUser) return;

    const data = await getDoc(doc(firestore, "users", auth.currentUser.uid));
    if (!data.exists) return;

    const userData = data.data() as UserStore;
    set({
      name: userData.name,
      email: userData.email,
      role: userData.role,
      skills: userData.skills,
      locations: userData.locations,
    });

    set({ hasInitialized: true });
  },
  updateSkillsAndLocations: async (skills: string[], locations: string[]) => {
    if (!auth.currentUser) return;

    const userRef = doc(firestore, "users", auth.currentUser.uid);
    await updateDoc(userRef, { skills, locations });
    set({ skills, locations });
  },
}));
