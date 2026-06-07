import "./ReadMore.css";

function CompanyDetails() {
  return (
    <div className="company-page">

      <h1>About Our Company</h1>

      <p className="intro">
        We are a modern education platform dedicated to providing high-quality
        online learning experiences for students worldwide.
      </p>

      <div className="section">

        <h2>🎯 Our Mission</h2>
        <p>
          To empower students with practical skills in technology,
          programming, and design to build their future careers.
        </p>

      </div>

      <div className="section">

        <h2>🚀 Our Vision</h2>
        <p>
          To become the leading online education platform in Sri Lanka
          and globally recognized for quality learning.
        </p>

      </div>

      <div className="section">

        <h2>👨‍🏫 What We Offer</h2>
        <ul>
          <li>Web Development Courses</li>
          <li>Java & Python Programming</li>
          <li>UI/UX Design Training</li>
          <li>Live Projects & Assignments</li>
        </ul>

      </div>

      <div className="section">

        <h2>📊 Why Choose Us</h2>
        <p>
          ✔ Expert Teachers <br />
          ✔ Affordable Prices <br />
          ✔ Practical Learning <br />
          ✔ Certificate Provided
        </p>

      </div>

    </div>
  );
}

export default CompanyDetails;