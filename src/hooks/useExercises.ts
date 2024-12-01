import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { saveExercises, getExercises } from "../utils/db";

const API_URL = import.meta.env.VITE_API_URL;

export const useExercises = () => {
  return useQuery({
    queryKey: ["exercises"],
    queryFn: async () => {
      try {
        const response = await axios.get(API_URL);
        await saveExercises(response.data.exercises); // Save for offline use
        return response.data.exercises;
      } catch (err) {
        console.warn("Offline mode: Loading stored exercises.", err);
        return getExercises(); // Load from IndexedDB when offline
      }
    },
  });
};
