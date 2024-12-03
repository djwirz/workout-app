import { useParams, Link } from "react-router-dom";
import { useWorkoutEntries } from "../hooks/useWorkoutEntries";

const WorkoutDetails = () => {
  const { id: workoutId } = useParams();
  const { data: workoutEntries, isLoading, error } = useWorkoutEntries(workoutId || "");

  if (isLoading) return <p>Loading workout entries...</p>;
  if (error) return <p>Failed to load workout entries.</p>;
  if (!workoutEntries || workoutEntries.length === 0) return <p>No entries found for this workout.</p>;

  return (
    <div>
      <h1>Workout Entries</h1>
      <Link to="/workouts">← Back to Workouts</Link>
      <ul>
        {workoutEntries.map((entry) => (
          <li key={entry.id}>
            <strong>{entry.exercise_name}</strong> - {entry.sets} sets x {entry.reps} reps, {entry.weight} lbs
            <br />
            Rest Time: {entry.rest_time} sec
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkoutDetails;
