import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import courseService from "../services/courseService";
import enrollmentService from "../services/enrollmentService";
import { subscribeDataUpdates } from "../services/liveUpdates";
import "./CourseView.css";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolled, setEnrolled] = useState(false);

  const loadCourse = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await courseService.fetchCourseById(id);
      setCourse(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to load course");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourse();

    return subscribeDataUpdates(({ resource }) => {
      if (!resource || resource === "courses") {
        loadCourse();
      }
    });
  }, [id]);

  useEffect(() => {
    // check if user already enrolled
    const checkEnrolled = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await enrollmentService.getMyCourses();
        if (Array.isArray(res.data)) {
          setEnrolled(res.data.some((c) => c.id === id));
        }
      } catch (e) {
        // ignore
      }
    };
    checkEnrolled();
  }, [id]);

  const handleEnroll = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { message: "Please login to enroll in this course." } });
      return;
    }
    navigate(`/enroll/${id}`);
  };

  if (loading) return <h2>Loading course...</h2>;
  if (error) return <h2>{error}</h2>;
  if (!course) return <h2>Course not found</h2>;

  return (
    <div className="course-details">
      <div className="course-header">
        <h1>{course.title}</h1>
        <p>{course.description}</p>
      </div>

      {course.imageUrl ? <img src={course.imageUrl} alt={course.title} style={{ maxWidth: "100%", borderRadius: 12, margin: "18px 0" }} /> : null}

      <div className="course-info">
        <div className="info-card">
          <h3>Instructor</h3>
          <p>{course.instructorName || "TBA"}</p>
        </div>

        <div className="info-card">
          <h3>Duration</h3>
          <p>{course.duration || "N/A"}</p>
        </div>

        <div className="info-card">
          <h3>Price</h3>
          <p>{course.price != null ? `LKR ${course.price}` : "Free"}</p>
        </div>

        <div className="info-card">
          <h3>Category</h3>
          <p>{course.category || "General"}</p>
        </div>

        <div className="info-card">
          <h3>Level</h3>
          <p>{course.level || "Beginner"}</p>
        </div>

        <div className="info-card">
          <h3>Created</h3>
          <p>{course.createdAt ? new Date(course.createdAt).toLocaleString() : "-"}</p>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Course Content / Syllabus</h3>
        <div style={{ whiteSpace: "pre-wrap" }}>{course.syllabus || "Syllabus not provided."}</div>
      </div>

      <div style={{ marginTop: 24 }}>
        {enrolled ? (
          <button className="enroll-btn" onClick={() => navigate(`/classroom/${id}`)}>
            Go to Classroom
          </button>
        ) : (
          <button className="enroll-btn" onClick={handleEnroll}>
            Enroll Now
          </button>
        )}
        {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
      </div>
    </div>
  );
}

export default CourseDetails;
