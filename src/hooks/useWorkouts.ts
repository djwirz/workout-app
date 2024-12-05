import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { saveWorkouts, getWorkouts } from "../utils/db";

const API_URL = import.meta.env.VITE_API_URL;

// Define a TypeScript type for workouts
export interface Workout {
  id: string;
  name: string;
  date: string;
}

export const useWorkouts = () => {
  return useQuery<Workout[]>({
    queryKey: ["workouts"],
    queryFn: async () => {
      const cachedWorkouts = await getWorkouts();
      if (Array.isArray(cachedWorkouts) && cachedWorkouts.length > 0) {
        console.log("✅ Loaded workouts from IndexedDB");
        return cachedWorkouts;
      }

      console.warn("⚠️ No workouts found locally. Please sync.");
      return [];
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
  });
};

export const useSyncWorkouts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        console.log("🔄 Syncing workouts with API...");
        await axios.post(`${API_URL}/sync-workouts`);

        const response = await axios.get<{ workouts: Workout[] }>(`${API_URL}/workouts`);
        const workouts = response.data.workouts;

        if (!Array.isArray(workouts) || workouts.length === 0) {
          console.warn("⚠️ API returned no workouts.");
          return [];
        }

        await saveWorkouts(workouts);
        return workouts;
      } catch (error) {
        console.error("❌ Workout sync failed:", error);
        throw new Error("Workout sync failed. Please try again.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
    onError: (error) => {
      console.error("❌ Workout Sync Error:", error);
    },
  });
};
