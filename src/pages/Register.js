// React hooks for component state
import React, { useState } from "react";
// API function to send registration data to backend
import { registerUser } from "../services/userService";
import "./Register.css"; // Optional CSS for styling

// Register page component
function Register({ onGoLogin }) {
  // Local state to store form values
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Update matching field whenever user types in an input
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle form submit and call registration API
  const handleSubmit = (e) => {
    // Prevent browser refresh on form submit
    e.preventDefault();

    // Trim whitespace from inputs
    const trimmedUser = {
      name: user.name.trim(),
      email: user.email.trim(),
      phone: user.phone.trim(),
      password: user.password,
      confirmPassword: user.confirmPassword,
    };

    // empty fields check
    if (!trimmedUser.name || !trimmedUser.email || !trimmedUser.phone || !trimmedUser.password || !trimmedUser.confirmPassword) {
      alert("Please fill all fields!");
      return;
    }


    // email validation (proper email format)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedUser.email)) {
      alert("Please enter a valid email address");
      return;
    }

    // phone number validation (exactly 10 digits)
    if (!/^\d{10}$/.test(trimmedUser.phone)) {
      alert("Phone number must be exactly 10 digits");
      return;
    }

    // password length check
    if (trimmedUser.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    // password complexity check (uppercase, lowercase, digit)
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(trimmedUser.password)) {
      alert("Password must contain uppercase, lowercase, and digit");
      return;
    }

    // password match check
    if (trimmedUser.password !== trimmedUser.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Send registration payload to backend
    registerUser(trimmedUser)
      .then((res) => {
        // Show success feedback
        alert("User registered successfully");
        // Log server response for debugging
        console.log(res.data);
      })
      .catch((err) => {
        // Show error feedback if request fails
        alert("Registration failed");
        // Log error details for debugging
        console.log(err);
      });
  };

  return (
    // Centered container for simple register UI
    <div className="container">
      <div className="form-box">
        {/* Page heading */}
        <h2>Register</h2>

        {/* Registration form */}
        <form onSubmit={handleSubmit}>
          {/* User registration fields */}
          {/* Name field */}
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={user.name}
              onChange={handleChange}
            />
          </div>
          <br />

          <div className="input-group">
            {/* Email field */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={user.email}
              onChange={handleChange}
            />
          </div>
          <br />

          {/* Phone field */}
          <div className="input-group">
            <input
              type="number"
              name="phone"
              placeholder="Phone Number"
              value={user.phone}
              onChange={handleChange}
            />
          </div>
          <br />

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
            />
          </div>
          <br />

          <div className="input-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={user.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {/* Submit button */}
          <button type="submit">Register</button>
        </form>

        <p>
          Already have an account?{" "}
          <button type="button" onClick={onGoLogin}>Login</button>
        </p>
      </div>
    </div>
  );
}

// Export component for use in App
export default Register;