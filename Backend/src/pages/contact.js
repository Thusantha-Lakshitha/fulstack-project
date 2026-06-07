import { useState } from "react";
import { Link } from "react-router-dom";
import "./contact.css";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [success, setSuccess] = useState(false);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // simple validation
    if (!form.name || !form.email || !form.message) {
      alert("Please fill all fields!");
      return;
    }

    console.log(form); // backend එකට යවන්න පුළුවන්
    setSuccess(true);

    // reset form
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact">

      <h1>Contact Us</h1>

      {success && <p className="success-msg">Message sent successfully!</p>}

      {!token ? (
        <div className="auth-only">
          <p>Please <Link to="/login">log in</Link> to send us a message.</p>
        </div>
      ) : (
        <div className="contact-container">

          {/* LEFT */}
          <div className="contact-info">
            <h3>Get in Touch</h3>
            <p>📧 info@tledu.com</p>
            <p>📞 +94 77 123 4567</p>
            <p>📍 Colombo, Sri Lanka</p>
          </div>

          {/* RIGHT FORM */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
            />

            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={form.message}
              onChange={handleChange}
            />

            <button type="submit">Send Message</button>
          </form>

        </div>
      )}

      {/* MAP */}
      <div className="map">
        <iframe
          title="map"
          src="https://maps.google.com/maps?q=colombo&t=&z=13&ie=UTF8&iwloc=&output=embed"
        ></iframe>
      </div>

    </div>
  );
}

export default Contact;