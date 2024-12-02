import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Exercises from "./pages/Exercises";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/exercises">Exercises</Link>
      </nav>
      <Routes>
        <Route path="/" element={<h1>Welcome to Workout App</h1>} />
        <Route path="/exercises" element={<Exercises />} />
      </Routes>
    </Router>
  );
}

export default App;
