import localforage from "localforage";

// Configure IndexedDB
localforage.config({
  name: "WorkoutApp",
  storeName: "workout_data",
});

// ====== EXERCISES ======
export const saveExercises = async (exercises: unknown[]) => {
  await localforage.setItem("exercises", exercises);
};

export const getExercises = async () => {
  return (await localforage.getItem("exercises")) || [];
};

// ====== VIDEOS ======
export const saveVideo = async (id: string, videoBlob: Blob) => {
  await localforage.setItem(`video-${id}`, videoBlob);
};

export const getVideo = async (id: string) => {
  return await localforage.getItem<Blob>(`video-${id}`);
};

// ====== WORKOUTS ======
export const saveWorkouts = async (workouts: unknown[]) => {
  await localforage.setItem("workouts", workouts);
};

export const getWorkouts = async () => {
  return (await localforage.getItem("workouts")) || [];
};

// ====== WORKOUT ENTRIES ======
export const saveWorkoutEntries = async (workoutId: string, entries: unknown[]) => {
  await localforage.setItem(`workout-entries-${workoutId}`, entries);
};

export const getWorkoutEntries = async (workoutId: string) => {
  return (await localforage.getItem(`workout-entries-${workoutId}`)) || [];
};
