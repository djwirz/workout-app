import localforage from "localforage";

// Configure IndexedDB store
localforage.config({
  name: "WorkoutApp",
  storeName: "workout_data",
});

// Save exercises to IndexedDB
export const saveExercises = async (exercises: unknown[]) => {
  await localforage.setItem("exercises", exercises);
};

// Get exercises from IndexedDB
export const getExercises = async () => {
  return (await localforage.getItem("exercises")) || [];
};
