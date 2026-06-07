import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/navbar";
import Dashboard from "./pages/Dashbord";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Footer from "./components/footer";
import Courses from "./pages/course";
import CourseDetails from "./pages/CourseView";
import CourseDetailsNew from "./pages/CourseDetails";
import Teachers from "./pages/Teacher";
import About from "./pages/About";
import Support from "./pages/Support";
import HelpCenter from "./pages/HelpCenter";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Enroll from "./pages/enroll";
import SearchResults from "./pages/SearchResults";
import ReadMore from "./pages/ReadMore";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import CourseLearn from "./pages/CourseLearn";
import Classroom from "./pages/Classroom";

function AppShell() {
  const location = useLocation();
  const role = (localStorage.getItem("role") || "").toUpperCase();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute ? <Navbar /> : null}

      <Routes>
        <Route path="/" element={role === "ADMIN" ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course" element={<Courses />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/courses/:id" element={<CourseDetailsNew />} />
        <Route path="/teacher" element={<Teachers />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Support />} />
        <Route path="/support" element={<Support />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/enroll/:id" element={<Enroll />} />
        <Route path="/ReadMore" element={<ReadMore />} />
        <Route
          path="/course/:courseId/learn"
          element={
            <ProtectedRoute allowedRoles={["STUDENT", "ADMIN"]}>
              <CourseLearn />
            </ProtectedRoute>
          }
        />
        <Route
          path="/classroom/:courseId"
          element={
            <ProtectedRoute allowedRoles={["STUDENT", "ADMIN", "TEACHER"]}>
              <Classroom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      {!isAdminRoute ? <Footer /> : null}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;