import "./About.css";

function About() {
  return (
    <div className="about">

      {/* HERO SECTION */}
      <div className="about-hero">
        <h1>About TL Education</h1>
        <p>
          We are dedicated to providing high-quality online education
          for students around the world.
        </p>
      </div>

      {/* CONTENT SECTION */}
      <div className="about-content">

        <div className="about-box">
          <h2>Our Mission</h2>
          <p>
            To make education accessible, affordable, and practical for everyone.
          </p>
        </div>

        <div className="about-box">
          <h2>Our Vision</h2>
          <p>
            To become a leading online learning platform that empowers learners globally.
          </p>
        </div>

        <div className="about-box">
          <h2>Why Choose Us</h2>
          <p>
            Expert teachers, practical courses, and flexible learning anytime.
          </p>
        </div>

      </div>

    </div>
  );
}

export default About;