import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { saveWorkoutEntries, getWorkoutEntries } from "../utils/db";

const API_URL = import.meta.env.VITE_API_URL;

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
      if (!workoutId) {
        console.error("❌ Invalid workout ID:", workoutId);
        throw new Error("Workout ID is required.");
      }

      console.log(`🔎 Attempting to load workout entries for ${workoutId} from IndexedDB`);
      const cachedEntries = await getWorkoutEntries(workoutId);

      if (Array.isArray(cachedEntries) && cachedEntries.length > 0) {
        console.log(`✅ Loaded ${cachedEntries.length} entries for workout ${workoutId}`);
        return cachedEntries;
      }

      console.warn(`⚠️ No workout entries found locally for ${workoutId}.`);
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
      if (!workoutId) {
        throw new Error("Workout ID is required for syncing.");
      }

      try {
        console.log(`🔄 Syncing workout entries for ${workoutId}...`);
        await axios.post(`${API_URL}/sync-workout-entries`);

        const response = await axios.get<{ entries: WorkoutEntry[] }>(`${API_URL}/workout/${workoutId}/entries`);
        const entries = response.data.entries;

        if (!Array.isArray(entries) || entries.length === 0) {
          console.warn(`⚠️ API returned no entries for workout ${workoutId}.`);
          return [];
        }

        console.log(`✅ Retrieved ${entries.length} entries from API. Saving to IndexedDB...`);
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
