import "./navbar.css";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Mail, Phone, Facebook, Twitter, Instagram, Search, Menu, X } from "react-feather";
import { clearAuthSession } from "../services/userService";



function Navbar(){
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [username, setUsername] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const syncUser = () => setUsername(localStorage.getItem("username") || "");

    syncUser();
    window.addEventListener("storage", syncUser);

    return () => window.removeEventListener("storage", syncUser);
  }, [location.pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    clearAuthSession();
    setUsername("");
    navigate("/login");
  };

  const getNavClass = ({ isActive }) =>
    isActive ? "nav-item nav-item-active" : "nav-item";

  return(
    <div>

      {/* 🔹 TOP BAR */}
      <div className="top-bar">
        <div ><a href="mailto:info@gmail.com" className="email-link" >
            <Mail size={18} /> 
            education@gmail.com</a>
             </div>


       <a href="tel:+94771234567" className="contact-link">
          <Phone size={18} />
           +94 77 123 4567
          </a>

        <div className="follow">
          <span>Follow us:</span>
          <a href="https://www.facebook.com/" className="social-media" target="_blank" rel="noreferrer"><Facebook size={18} color="white"/></a>
          <a href="https://twitter.com/" className="social-media" target="_blank" rel="noreferrer"><Twitter size={18} color="white" /></a>
          <a href="https://www.instagram.com/" className="social-media" target="_blank" rel="noreferrer"><Instagram size={18} color="white" /></a>

          {username ? (
            <>
              <span className="auth-user-label">Hi, {username}</span>
              <button type="button" className="auth-button-Login" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="auth-button-Login">Login</Link>
              <Link to="/register" className="auth-button-Register">Register</Link>
            </>
          )}
        </div>
      </div>

      {/* 🔹 MAIN NAVBAR */}
      <div className="main-navbar">

        <div className="logo">TL-Education</div>

        <button
          type="button"
          className="hamburger-btn"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
          <NavLink to="/dashboard" className={getNavClass}>Home</NavLink>
          <NavLink to="/course" className={getNavClass}>Courses</NavLink>
          <NavLink to="/teacher" className={getNavClass}>Teachers</NavLink>
          <NavLink to="/about" className={getNavClass}>About Us</NavLink>
          <NavLink to="/contact" className={getNavClass}>Contact</NavLink>
        </div>

        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search courses or teachers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate(`/search?q=${encodeURIComponent(query.trim())}`);
              }
            }}
          />
        </div>

      </div>

    </div>
    );
}

export default Navbar;
