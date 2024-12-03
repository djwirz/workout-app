import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { saveWorkoutEntries, getWorkoutEntries } from "../utils/db";

const API_URL = import.meta.env.VITE_API_URL;

// Define a TypeScript type for workout entries
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

export const useWorkoutEntries = (workoutId: string) => {
  return useQuery<WorkoutEntry[]>({
    queryKey: ["workout-entries", workoutId],
    queryFn: async () => {
      const cachedEntries = await getWorkoutEntries(workoutId);
      if (Array.isArray(cachedEntries) && cachedEntries.length > 0) {
        console.log(`✅ Loaded entries for workout ${workoutId} from IndexedDB`);
        return cachedEntries;
      }

      console.warn(`⚠️ No entries found locally for workout ${workoutId}. Please sync.`);
      return [];
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
  });
};

export const useSyncWorkoutEntries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workoutId: string) => {
      try {
        console.log(`🔄 Syncing workout entries for workout ${workoutId}...`);
        await axios.post(`${API_URL}/sync-workout-entries`);

        const response = await axios.get<{ entries: WorkoutEntry[] }>(`${API_URL}/workout/${workoutId}/entries`);
        const entries = response.data.entries;

        if (!Array.isArray(entries) || entries.length === 0) {
          console.warn(`⚠️ API returned no entries for workout ${workoutId}.`);
          return [];
        }

        await saveWorkoutEntries(workoutId, entries);
        return entries;
      } catch (error) {
        console.error(`❌ Workout entries sync failed for workout ${workoutId}:`, error);
        throw new Error("Workout entries sync failed. Please try again.");
      }
    },
    onSuccess: (_data, workoutId) => {
      queryClient.invalidateQueries({ queryKey: ["workout-entries", workoutId] });
    },
    onError: (error) => {
      console.error("❌ Workout Entries Sync Error:", error);
    },
  });
};
