import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Exercises from "./pages/Exercises";
import Planned from "./pages/Planned";
import Ongoing from "./pages/Ongoing";
import Completed from "./pages/Completed";
import Templates from "./pages/Templates";

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/planned" element={<Planned />} />
          <Route path="/ongoing" element={<Ongoing />} />
          <Route path="/completed" element={<Completed />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/exercises" element={<Exercises />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="home">
      <h1>Workouts</h1>
      <nav className="home-links">
        <Link to="/planned">Planned</Link>
        <Link to="/ongoing">Ongoing</Link>
        <Link to="/completed">Completed</Link>
        <Link to="/templates">Templates</Link>
        <Link to="/exercises">Exercises</Link>
      </nav>
    </div>
  );
}
export default App;