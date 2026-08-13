import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Tasks from "./pages/Tasks";
import Inventory from "./pages/Inventory";
import DeckDetail from "./pages/DeckDetail";
import { StudyProvider } from "./data/StudyData";

export default function App() {
  return (
    <StudyProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing page without sidebar */}
          <Route path="/" element={<Landing />} />

          {/* Authenticated / App Shell routes with Sidebar */}
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/decks" element={<Tasks />} />
            <Route path="/tasks" element={<Navigate to="/decks" replace />} />
            <Route path="/decks/:courseId/:deckId" element={<DeckDetail />} />
            <Route path="/inventory" element={<Inventory />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </StudyProvider>
  );
}
