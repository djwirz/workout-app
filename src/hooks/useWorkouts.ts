import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { saveWorkouts, getWorkouts, saveWorkoutEntries } from "../utils/db";

const API_URL = import.meta.env.VITE_API_URL;

// Define a TypeScript type for workouts
export interface Workout {
  id: string;
  name: string;
  date: string;
}

// Workout Entry type
export interface WorkoutEntry {
  id: string;
  workout_id: string;
  exercise_id: string;
  exercise_name: string;
  sets: number;
  reps: number;
  weight: number;
  rest_time: number;
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
        console.log(`✅ Saved ${workouts.length} workouts to IndexedDB`);

        // Sync corresponding workout entries
        for (const workout of workouts) {
          try {
            const entryResponse = await axios.get<{ entries: WorkoutEntry[] }>(`${API_URL}/workout/${workout.id}/entries`);
            const entries = entryResponse.data.entries;

            if (Array.isArray(entries) && entries.length > 0) {
              console.log(`📥 Saving ${entries.length} entries for workout ${workout.id}`);
              await saveWorkoutEntries(workout.id, entries);
            } else {
              console.warn(`⚠️ No workout entries found for workout ${workout.id}.`);
            }
          } catch (entryError) {
            console.error(`❌ Failed to fetch entries for workout ${workout.id}:`, entryError);
          }
        }

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
