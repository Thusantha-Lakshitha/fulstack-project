import { Link, useParams } from "react-router-dom";
import "./CourseView.css";
import { courses } from "./courseData";


function CourseDetails() {
  const { id } = useParams();

  const course = courses.find((c) => c.id === Number(id));

  if (!course) {
    return <h2>Course not found</h2>;
  }

  return (
    <div className="course-details">

      {/* TITLE */}
      <div className="course-header">
        <h1>{course.title}</h1>
        <p>{course.description}</p>
      </div>

      {/* INFO BOX */}
      <div className="course-info">

        <div className="info-card">
          <h3>Lessons</h3>
          <p>{course.lessons}</p>
        </div>

        <div className="info-card">
          <h3>Duration</h3>
          <p>{course.duration}</p>
        </div>

        <div className="info-card">
          <h3>Instructor</h3>
          <p>{course.instructor}</p>
        </div>

        <div className="info-card price">
          <h3>Price</h3>
          <p>{course.price}</p>
        </div>

      </div>

      {/* BUTTON */}
      <Link to={`/enroll/${course.id}`} className="enroll-btn">
        Enroll Now
      </Link>

    </div>
  );
}

export default CourseDetails;