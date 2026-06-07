import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/navbar";
import Dashboard from "./pages/Dashbord";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Footer from "./components/footer";
import Courses from "./pages/course";
import CourseDetails from "./pages/CourseView";
import Teachers from "./pages/Teacher";
import About from "./pages/About";
import Contact from "./pages/contact";
import Enroll from "./pages/enroll";
import SearchResults from "./pages/SearchResults";
import ReadMore from "./pages/ReadMore";


function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course" element={<Courses />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/teacher" element={<Teachers />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/enroll/:id" element={<Enroll />} />
        <Route path="/ReadMore" element={<ReadMore />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;