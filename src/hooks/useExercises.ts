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
    refetchOnMount: false, // Prevent unnecessary API calls on mount
    refetchOnWindowFocus: false, // Don't refetch when switching tabs
  });
};

export const useSyncExercises = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      console.log("🔄 Syncing exercises with API...");
      const response = await axios.post<{ exercises: Exercise[] }>(`${API_URL}/sync`);
      const exercises = response.data.exercises;

      // Ensure exercises are correctly mapped and stored
      const formattedExercises = exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        group: exercise.group, // Ensure correct property mapping
        hasVideo: Boolean(exercise.hasVideo),
      }));

      await saveExercises(formattedExercises);

      // Download and cache videos
      for (const exercise of formattedExercises) {
        if (exercise.hasVideo) {
          const existingVideo = await getVideo(exercise.id);
          if (!existingVideo) {
            console.log(`📥 Downloading video for ${exercise.name}...`);
            const videoResponse = await axios.get(`${API_URL}/video/${exercise.id}`, {
              responseType: "blob",
            });
            await saveVideo(exercise.id, videoResponse.data);
          }
        }
      }

      return formattedExercises;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });
};
