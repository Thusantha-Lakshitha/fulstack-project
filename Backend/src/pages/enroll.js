import { useParams, Link } from "react-router-dom";
import "./enroll.css";
import { courses } from "./courseData";

function Enroll() {
  const { id } = useParams();
  const course = courses.find((item) => item.id === Number(id));

  const token = localStorage.getItem("token");

  if (!course) {
    return <h2>Course not found</h2>;
  }

  if (!token) {
    return (
      <div className="enroll-page">
        <div className="enroll-card">
          <h1>Enroll Course</h1>
          <p className="auth-note">Please <Link to="/login">log in</Link> to enroll in this course.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="enroll-page">
      <div className="enroll-card">
        <h1>Enroll Course</h1>

        <div className="course-box">
          <h2>{course.title}</h2>
          <p>{course.description}</p>

          <div className="course-info">
            <p><strong>Instructor:</strong> {course.instructor}</p>
            <p><strong>Duration:</strong> {course.duration}</p>
            <p><strong>Price:</strong> {course.price}</p>
          </div>
        </div>

        <form className="enroll-form">
          <input type="text" placeholder="Enter Your Name" required />
          <input type="email" placeholder="Enter Your Email" required />
          <input type="tel" placeholder="Enter Phone Number" required />
          <button type="submit">Confirm Enrollment</button>
        </form>
      </div>
    </div>
  );
}

export default Enroll;
