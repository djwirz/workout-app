import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { saveExercises, getExercises, saveVideo, getVideo } from "../utils/db";

const API_URL = import.meta.env.VITE_API_URL;

// Define a TypeScript type for exercises
export interface Exercise {
  id: string;
  name: string;
  group: string; // Mapped from `muscle_group`
  hasVideo: boolean;
}

export const useExercises = () => {
  return useQuery<Exercise[]>({
    queryKey: ["exercises"],
    queryFn: async () => {
      const cachedExercises = await getExercises();
      if (Array.isArray(cachedExercises) && cachedExercises.length > 0) {
        console.log("✅ Loaded exercises from IndexedDB");
        return cachedExercises;
      }

      console.warn("⚠️ No exercises found locally. Please sync.");
      return [];
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
        console.log("🔄 Syncing exercises with API...");
        await axios.post(`${API_URL}/sync`);

        const response = await axios.get<{ exercises: Exercise[] }>(`${API_URL}/exercises`);
        const exercises = response.data.exercises;

        if (!Array.isArray(exercises) || exercises.length === 0) {
          console.warn("⚠️ API returned no exercises.");
          return [];
        }

        // Ensure exercises are correctly mapped and stored
        const formattedExercises: Exercise[] = exercises.map((exercise) => ({
          id: exercise.id ?? "missing_id",
          name: exercise.name ?? "Unknown Exercise",
          group: exercise.group ?? "Unknown Group",
          hasVideo: Boolean(exercise.hasVideo),
        }));

        await saveExercises(formattedExercises);

        // Download and cache videos
        for (const exercise of formattedExercises) {
          if (!exercise.id || exercise.id === "missing_id") {
            console.error(`❌ Invalid exercise ID detected:`, exercise);
            continue;
          }

          if (exercise.hasVideo) {
            const existingVideo = await getVideo(exercise.id);
            if (!existingVideo) {
              console.log(`📥 Downloading video for ${exercise.name} (ID: ${exercise.id})...`);
              try {
                const videoResponse = await axios.get(`${API_URL}/video/${exercise.id}`, {
                  responseType: "blob",
                });
                await saveVideo(exercise.id, videoResponse.data);
              } catch (videoError) {
                console.error(`❌ Failed to download video for ${exercise.name} (ID: ${exercise.id}):`, videoError);
              }
            }
          }
        }

        return formattedExercises;
      } catch (error) {
        console.error("❌ Sync failed due to an error:", error);
        throw new Error("Sync failed. Please try again.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
    onError: (error) => {
      console.error("❌ Sync Error:", error);
    },
  });
};
