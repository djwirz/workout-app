import { useExercises } from "../hooks/useExercises";

const Exercises = () => {
  const { data: exercises, isLoading, error } = useExercises();

  if (isLoading) return <p>Loading exercises...</p>;
  if (error) return <p>Failed to load exercises.</p>;

  return (
    <div>
      <h1>Exercises</h1>
      <ul>
        {exercises?.map((exercise: { id: string; name: string; group: string }) => (
          <li key={exercise.id}>
            <strong>{exercise.name}</strong> - {exercise.group}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Exercises;
