import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { saveExercises, getExercises, saveVideo, getVideo } from "../utils/db";

const API_URL = import.meta.env.VITE_API_URL;

export const useExercises = () => {
  return useQuery({
    queryKey: ["exercises"],
    queryFn: async () => {
      const cachedExercises = await getExercises();
      if (Array.isArray(cachedExercises) && cachedExercises.length > 0) {
        console.log("✅ Loaded exercises from IndexedDB");
        return cachedExercises;
      }

      console.log("🌍 Fetching exercises from API...");
      const response = await axios.get(`${API_URL}/exercises`);
      await saveExercises(response.data.exercises);
      return response.data.exercises;
    },
  });
};

export const useSyncExercises = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      console.log("🔄 Syncing exercises with API...");
      const response = await axios.post(`${API_URL}/sync`);
      const exercises = response.data.exercises;
      await saveExercises(exercises);

      // Download and cache videos
      for (const exercise of exercises) {
        if (exercise.hasVideo) {
          const existingVideo = await getVideo(exercise.id);
          if (!existingVideo) {
            const videoResponse = await axios.get(`${API_URL}/video/${exercise.id}`, {
              responseType: "blob",
            });
            await saveVideo(exercise.id, videoResponse.data);
          }
        }
      }

      return exercises;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });
};
