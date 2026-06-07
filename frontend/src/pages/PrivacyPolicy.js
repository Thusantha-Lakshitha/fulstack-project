import React from "react";
import "./PrivacyPolicy.css";

function PrivacyPolicy() {
  return (
    <div className="policy-page-container">
      <div className="policy-header-banner">
        <h1>Privacy Policy</h1>
        <p>Last updated: June 7, 2026</p>
      </div>

      <main className="policy-content">
        <section className="policy-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to TL-Education. We value your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, store, and share your personal information when you use our online learning platform.
          </p>
        </section>

        <section className="policy-section">
          <h2>2. Data Collection Policy</h2>
          <p>We collect information that you provide to us directly, including:</p>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, password, and phone number when you register an account.</li>
            <li><strong>Enrollment Data:</strong> Courses you join, completion progress, and performance scores.</li>
            <li><strong>Payment Details:</strong> Expiration dates, cardholder names, CVV, and transaction identifiers. Full credit card numbers are processed by our secure gateway and are not stored permanently.</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>3. User Privacy and How We Use Your Data</h2>
          <p>Your data is used to provide, improve, and secure our educational services. Specifically, we use your information to:</p>
          <ul>
            <li>Process registrations and course enrollments.</li>
            <li>Send email updates, registration confirmations, and payment receipts.</li>
            <li>Analyze usage metrics to optimize platform responsiveness and catalog quality.</li>
            <li>Secure accounts against fraud, access abuse, or unauthorized sharing.</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>4. Cookies & Trackers</h2>
          <p>
            We use essential session cookies to keep you logged in and preserve active sessions. Analytical trackers may be used to understand search queries and optimize navigation. You can configure your browser to disable cookies, but certain core features of the site may cease to function correctly.
          </p>
        </section>

        <section className="policy-section">
          <h2>5. Contact Information</h2>
          <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy, your personal data, or your privacy rights, please contact our privacy compliance officer at:
          </p>
          <div className="policy-contact-box">
            <p><strong>TL-Education Support</strong></p>
            <p>📧 privacy@tledu.com</p>
            <p>📞 +94 77 123 4567</p>
            <p>📍 Colombo, Sri Lanka</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default PrivacyPolicy;
