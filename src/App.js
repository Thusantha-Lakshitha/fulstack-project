import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar";
import Dashboard from "./pages/Dashbord";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Footer from "./components/footer";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;