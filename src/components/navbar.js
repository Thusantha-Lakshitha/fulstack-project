import "./navbar.css";
import { Link } from "react-router-dom";
import { Mail, Phone, Facebook, Twitter, Instagram, Search } from "react-feather";



function Navbar(){

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

          <Link to="/login" className="auth-button-Login">Login</Link>
          <Link to="/register" className="auth-button-Register">Register</Link>
        </div>
      </div>

      {/* 🔹 MAIN NAVBAR */}
      <div className="main-navbar">

        <div className="logo">TL-Education</div>

        <div className="nav-links">
          <Link to="/dashboard">Home</Link>
          <Link to="/pages">Pages</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/teachers">Teachers</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>

             

          
        </div>
          <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search..." />
        </div>

      </div>

    </div>
    
 


    );
}

export default Navbar;
