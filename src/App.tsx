import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { useState } from "react";
import Planned from "./pages/Planned";
import Ongoing from "./pages/Ongoing";
import Completed from "./pages/Completed";
import Templates from "./pages/Templates";
import Exercises from "./pages/Exercises";
import { HomeIcon, ClipboardIcon } from "@heroicons/react/24/solid";

export default function App() {
  // State to track which top tab is active
  const [activeTab, setActiveTab] = useState("Planned");

  return (
    <Router>
      <div className="min-h-screen bg-black text-white flex flex-col">
        {/* Persistent Page Header - Always Above Navigation */}
        <header className="text-center text-2xl font-bold py-4">
          Workouts
        </header>

        {/* Top Navigation */}
        <nav className="flex justify-center border-b border-gray-700 text-lg">
          {["Templates", "Planned", "Completed"].map((tab) => (
            <Link
              key={tab}
              to={`/${tab.toLowerCase()}`}
              className={`px-4 py-3 ${activeTab === tab ? "underline" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Link>
          ))}
        </nav>

        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center text-xl">
          <Routes>
            <Route path="/" element={<Navigate to="/planned" replace />} />
            <Route path="/planned" element={<Planned />} />
            <Route path="/ongoing" element={<Ongoing />} />
            <Route path="/completed" element={<Completed />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/exercises" element={<Exercises />} />
          </Routes>
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 w-full bg-black border-t border-gray-700 flex justify-around py-3">
          <Link to="/ongoing" className="flex flex-col items-center text-sm">
            <HomeIcon className="h-6 w-6" />
            <span>Ongoing</span>
          </Link>
          <Link to="/exercises" className="flex flex-col items-center text-sm">
            <ClipboardIcon className="h-6 w-6" />
            <span>Exercises</span>
          </Link>
        </nav>
      </div>
    </Router>
  );
}
