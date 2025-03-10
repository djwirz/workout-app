import { Link } from "react-router-dom";
import { useWorkouts, useSyncWorkouts } from "../hooks/useWorkouts";

const Workouts = () => {
  const { data: workouts, isLoading, error } = useWorkouts();
  const syncWorkouts = useSyncWorkouts();

  if (isLoading) return <p>Loading workouts...</p>;
  if (error) return <p>Failed to load workouts.</p>;

  return (
    <div>
      <h1>Workouts</h1>
      <button onClick={() => syncWorkouts.mutate()} disabled={syncWorkouts.isPending}>
        {syncWorkouts.isPending ? "Syncing..." : "Sync Workouts"}
      </button>
      <ul>
        {workouts?.map((workout) => (
          <li key={workout.id}>
            <Link to={`/workouts/${workout.id}`} style={{ textDecoration: "underline", color: "blue" }}>
              <strong>{workout.name}</strong>
            </Link>{" "}
            - {workout.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Workouts;
