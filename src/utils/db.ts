import localforage from "localforage";

// Configure IndexedDB
localforage.config({
  name: "WorkoutApp",
  storeName: "workout_data",
});

// Save exercises
export const saveExercises = async (exercises: unknown[]) => {
  await localforage.setItem("exercises", exercises);
};

// Get exercises
export const getExercises = async () => {
  return (await localforage.getItem("exercises")) || [];
};

// Save video blob
export const saveVideo = async (id: string, videoBlob: Blob) => {
  await localforage.setItem(`video-${id}`, videoBlob);
};

// Get video blob
export const getVideo = async (id: string) => {
  return await localforage.getItem<Blob>(`video-${id}`);
};

// Save last sync time
export const setLastSyncTime = async (timestamp: number) => {
  await localforage.setItem("lastSyncTime", timestamp);
};

// Get last sync time (defaults to 0 if not set)
export const getLastSyncTime = async () => {
  return (await localforage.getItem<number>("lastSyncTime")) || 0;
};
