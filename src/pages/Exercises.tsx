import { useExercises, useSyncExercises } from "../hooks/useExercises";
import { getVideo } from "../utils/db";
import { useEffect, useState } from "react";
import SyncButton from "../components/SyncButton";

interface Exercise {
  id: string;
  name: string;
  group: string;
}

const Exercises = () => {
  const { data: exercises, isLoading, error } = useExercises();
  const syncExercises = useSyncExercises();
  const [videos, setVideos] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadVideos = async () => {
      const videoMap: Record<string, string> = {};
      for (const exercise of exercises || []) {
        const videoBlob = await getVideo(exercise.id);
        if (videoBlob) {
          videoMap[exercise.id] = URL.createObjectURL(videoBlob);
        }
      }
      setVideos(videoMap);
    };
    loadVideos();
  }, [exercises]);

  if (isLoading) return <p>Loading exercises...</p>;
  if (error) return <p>Failed to load exercises.</p>;

  return (
    <div>
      <h1>Exercises</h1>
      <SyncButton 
        onSync={() => syncExercises.mutate()}
        isPending={syncExercises.isPending}
        label="Sync Exercises"
      />
      <ul>
        {exercises?.map((exercise: Exercise) => (
          <li key={exercise.id}>
            <strong>{exercise.name}</strong> - {exercise.group}
            {videos[exercise.id] ? (
              <video controls width="250">
                <source src={videos[exercise.id]} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <p>No video available</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Exercises;
