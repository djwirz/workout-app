import { useParams, Link } from "react-router-dom";
import { useWorkoutEntries } from "../hooks/useWorkoutEntries";

const WorkoutDetails = () => {
  const { id: workoutId } = useParams();

  console.log(`📌 WorkoutDetails.tsx: Rendering for workout ID ${workoutId}`);

  const { data: workoutEntries, isLoading, error } = useWorkoutEntries(workoutId || "");

  if (isLoading) {
    console.log("⏳ Loading workout entries...");
    return <p>Loading workout entries...</p>;
  }

  if (error) {
    console.error("❌ Error loading workout entries:", error);
    return <p>Failed to load workout entries.</p>;
  }

  if (!workoutEntries || workoutEntries.length === 0) {
    console.warn(`⚠️ No entries found for workout ${workoutId}`);
    return <p>No entries found. Try syncing while online.</p>;
  }

  console.log(`✅ Rendering ${workoutEntries.length} entries for workout ${workoutId}`);

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
