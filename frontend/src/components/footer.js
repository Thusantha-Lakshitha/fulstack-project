import { Link } from "react-router-dom";
import "./footer.css";

import { FaFacebook, FaYoutube, FaTwitter, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* About */}
        <div className="footer-section">
          <h3>EduLearn</h3>
          <p>
            Learn anytime, anywhere. Improve your skills with our online courses
            and expert instructors.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/dashboard">Home</Link></li>
          
            <li><Link to="/course">Courses</Link></li>
            <li><Link to="/teacher">Teachers</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><Link to="/support">Support</Link></li>
            <li><Link to="/help-center">Help Center</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <FaFacebook />
            <FaYoutube />
            <FaTwitter />
            <FaInstagram />
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 EduLearn. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
