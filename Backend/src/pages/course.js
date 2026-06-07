import "./course.css";
import { Link } from "react-router-dom";
import { courses } from "./courseData";

function Courses() {
  return (
    <div className="courses">
      <h1>Our Courses</h1>

      <div className="course-container">
        {courses.map((course) => (
          <div className="course-card" key={course.id}>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <Link to={`/course/${course.id}`} className="course-details-link">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;