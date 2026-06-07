import React from "react";
import "./Terms.css";

function Terms() {
  return (
    <div className="terms-page-container">
      <div className="terms-header-banner">
        <h1>Terms & Conditions</h1>
        <p>Last updated: June 7, 2026</p>
      </div>

      <main className="terms-content">
        <section className="terms-section">
          <h2>1. Course Usage Terms</h2>
          <p>
            When you enroll in a course on TL-Education, we grant you a limited, non-exclusive, non-transferable license to access and watch the course videos and view/download the provided lecture notes for personal, educational, non-commercial purposes.
          </p>
          <p>
            You are prohibited from copying, distributing, recording, transmitting, selling, sharing, or creating derivative works of any classroom videos or notes. All content remains the intellectual property of TL-Education and its instructors.
          </p>
        </section>

        <section className="terms-section">
          <h2>2. User Responsibilities</h2>
          <p>As a student or visitor using our services, you agree that:</p>
          <ul>
            <li>You will provide accurate, current, and complete registration information.</li>
            <li>You will maintain the confidentiality of your account credentials.</li>
            <li>You will not use the support portal to send spam, abusive comments, or malicious inquiries.</li>
            <li>You will respect other students, teachers, and administrators on the platform.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>3. Payment & Refund Terms</h2>
          <p>
            Enrollment in paid courses requires successful transaction processing. If you choose Credit/Debit Card billing, you agree to provide valid credentials and authorize the transaction. Cash or bank transfer statuses remain pending until manually checked by our finance team.
          </p>
          <p>
            Refund requests are subject to approval. If you request a refund within 7 days of course checkout and have not completed course videos, downloaded notes, or started classroom learning, a full refund may be issued.
          </p>
        </section>

        <section className="terms-section">
          <h2>4. Account Restrictions</h2>
          <p>
            We reserve the right to temporarily suspend or permanently terminate your account if you violate these terms. Account restrictions will apply in case of:
          </p>
          <ul>
            <li>Sharing login details with third parties.</li>
            <li>Accessing secure classroom content using fraudulent payments.</li>
            <li>Violating intellectual property permissions (recording videos or re-uploading notes).</li>
            <li>Repeated misconduct or malicious interactions with backend resources.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>5. Changes to Terms</h2>
          <p>
            We may revise these Terms & Conditions from time to time. The revised version will be effective immediately upon posting. Your continued use of the platform constitutes acceptance of the updated terms.
          </p>
        </section>
      </main>
    </div>
  );
}

export default Terms;
