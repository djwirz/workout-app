import { Link } from "react-router-dom";
import { useWorkouts, useSyncWorkouts } from "../hooks/useWorkouts";
import SyncButton from "../components/SyncButton";

const Workouts = () => {
  const { data: workouts, isLoading, error } = useWorkouts();
  const syncWorkouts = useSyncWorkouts();

  if (isLoading) return <p>Loading workouts...</p>;
  if (error) return <p>Failed to load workouts.</p>;

  return (
    <div className="px-4 py-4">
      <SyncButton 
        onSync={() => syncWorkouts.mutate()}
        isPending={syncWorkouts.isPending}
        className="mb-4"
        label="Sync Workouts"
      />
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
