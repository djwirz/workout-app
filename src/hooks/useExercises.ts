import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { saveExercises, getExercises, saveVideo, getVideo, getLastSyncTime, setLastSyncTime } from "../utils/db";

const API_URL = import.meta.env.VITE_API_URL;

// Define a TypeScript type for exercises
export interface Exercise {
  id: string;
  name: string;
  group: string;
  hasVideo: boolean;
}

export const useExercises = () => {
  return useQuery<Exercise[]>({
    queryKey: ["exercises"],
    queryFn: async () => {
      try {
        const cachedExercises = await getExercises() as Exercise[];
        return cachedExercises || [];
      } catch (error) {
        console.error("Error fetching exercises:", error);
        return [] as Exercise[];
      }
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
  });
};

export const useSyncExercises = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        const lastSyncTime = await getLastSyncTime();
        console.log(`🔄 Syncing new exercises with API since ${lastSyncTime}`);

        const response = await axios.post<{ exercises: Exercise[]; lastSyncTime: number }>(
          `${API_URL}/sync`,
          { lastSyncTime }
        );

        const exercises = response.data.exercises;
        if (!exercises.length) {
          console.warn("⚠️ No new exercises found.");
          return [];
        }

        await saveExercises(exercises);
        await setLastSyncTime(response.data.lastSyncTime);

        // Only fetch videos for new exercises
        for (const exercise of exercises) {
          if (!exercise.hasVideo) continue;

          const existingVideo = await getVideo(exercise.id);
          if (!existingVideo) {
            console.log(`📥 Downloading video for ${exercise.name} (ID: ${exercise.id})...`);
            try {
              const videoResponse = await axios.get(`${API_URL}/video/${exercise.id}`, { responseType: "blob" });
              await saveVideo(exercise.id, videoResponse.data);
            } catch (videoError) {
              console.error(`❌ Failed to download video for ${exercise.name} (ID: ${exercise.id}):`, videoError);
            }
          }
        }

        return exercises;
      } catch (error) {
        console.error("❌ Sync failed:", error);
        throw new Error("Sync failed.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });
};
