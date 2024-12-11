import { Link } from "react-router-dom";
import { useWorkouts, useSyncWorkouts } from "../hooks/useWorkouts";

const Workouts = () => {
  const { data: workouts, isLoading, error } = useWorkouts();
  const syncWorkouts = useSyncWorkouts();

  if (isLoading) return <p>Loading workouts...</p>;
  if (error) return <p>Failed to load workouts.</p>;

  return (
    <div className="px-4 py-4">
      <button
        onClick={() => syncWorkouts.mutate()}
        disabled={syncWorkouts.isPending}
        className="mb-4 px-4 py-2 bg-gray-700 rounded"
      >
        {syncWorkouts.isPending ? "Syncing..." : "Sync Workouts"}
      </button>
      <ul>
        {workouts?.map((workout) => (
          <li key={workout.id} className="mt-2">
            <Link to={`/workouts/${workout.id}`} className="text-blue-400 underline">
              <strong>{workout.name}</strong>
            </Link>{" "}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Workouts;
