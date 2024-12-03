import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Exercises from "./pages/Exercises";
import Workouts from "./pages/Workouts";
import WorkoutDetails from "./pages/WorkoutDetails";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/exercises">Exercises</Link> | <Link to="/workouts">Workouts</Link>
      </nav>
      <Routes>
        <Route path="/" element={<h1>Welcome to Workout App</h1>} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/workouts/:id" element={<WorkoutDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
