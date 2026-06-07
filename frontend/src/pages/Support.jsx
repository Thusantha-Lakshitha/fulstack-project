import { useState } from "react";
import contactMessagesService from "../services/contactMessagesService";
import "./Support.css";

function Support() {
  const [form, setForm] = useState({
    name: localStorage.getItem("username") || "",
    email: localStorage.getItem("email") || "",
    subject: "",
    message: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError("");

    // validations
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setError("Please fill all fields!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      await contactMessagesService.submitMessage({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      setSuccess(true);
      setForm({
        name: localStorage.getItem("username") || "",
        email: localStorage.getItem("email") || "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.response?.data?.error || err.message || "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="support-page-container">
      <h1>Support Center</h1>

      {success && <p className="success-msg" role="alert">Your message has been sent successfully.</p>}
      {error && <p className="error-msg" role="alert">{error}</p>}

      <div className="support-content-layout">
        {/* LEFT */}
        <div className="support-info-panel">
          <h3>Contact Support</h3>
          <p>If you have any questions, feedback, or issues with course enrollment or payments, send us a message and our support team will get back to you as soon as possible.</p>
          <div className="contact-details-list">
            <p>📧 support@tledu.com</p>
            <p>📞 +94 77 123 4567</p>
            <p>📍 Colombo, Sri Lanka</p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <form className="support-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
            required
          />

          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={form.message}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={submitting}>
            {submitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>

      {/* MAP */}
      <div className="support-map">
        <iframe
          title="map"
          src="https://maps.google.com/maps?q=colombo&t=&z=13&ie=UTF8&iwloc=&output=embed"
        ></iframe>
      </div>
    </div>
  );
}

export default Support;
