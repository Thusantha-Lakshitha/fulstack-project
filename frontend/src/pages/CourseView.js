import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./CourseView.css";
import courseService from "../services/courseService";
import { subscribeDataUpdates } from "../services/liveUpdates";


function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadCourse = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await courseService.fetchCourseById(id);
        if (active) {
          setCourse(data);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.response?.data?.error || requestError.message || "Course not found");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadCourse();

    return subscribeDataUpdates(({ resource }) => {
      if (!resource || resource === "courses") {
        loadCourse();
      }
    });
  }, [id]);

  if (loading) {
    return <h2>Loading course...</h2>;
  }

  if (error || !course) {
    return <h2>{error || "Course not found"}</h2>;
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
          <p>{course.seatsAvailable ?? 0}</p>
        </div>

        <div className="info-card">
          <h3>Duration</h3>
          <p>{course.duration}</p>
        </div>

        <div className="info-card">
          <h3>Instructor</h3>
          <p>{course.instructorName || "TBA"}</p>
        </div>

        <div className="info-card price">
          <h3>Price</h3>
          <p>{course.price != null ? `LKR ${course.price}` : "Free"}</p>
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