import "./course.css";
import { useEffect, useState } from "react";
import courseService from "../services/courseService";
import enrollmentService from "../services/enrollmentService";
import { subscribeDataUpdates } from "../services/liveUpdates";
import CourseCard from "../components/CourseCard";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCoursesAndEnrollments = async () => {
    setLoading(true);
    setError("");

    try {
      // Fetch all courses
      const response = await courseService.fetchCourses({ size: 100 });
      setCourses(response.content || []);

      // Fetch enrolled courses if user is logged in
      const token = localStorage.getItem("token");
      if (token) {
        const enrollmentsRes = await enrollmentService.getMyCourses();
        if (Array.isArray(enrollmentsRes.data)) {
          setEnrolledCourseIds(enrollmentsRes.data.map((c) => c.id));
        }
      }
    } catch (requestError) {
      setError(requestError.response?.data?.error || requestError.message || "Unable to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoursesAndEnrollments();

    return subscribeDataUpdates(({ resource }) => {
      if (!resource || resource === "courses" || resource === "enrollments") {
        loadCoursesAndEnrollments();
      }
    });
  }, []);

  return (
    <div className="courses">
      <h1>Our Courses</h1>

      {loading ? <p style={{ color: "#ffffff" }}>Loading courses...</p> : null}
      {error ? <p role="alert" style={{ color: "#ef4444" }}>{error}</p> : null}

      <div className="course-container">
        {!loading && !error && courses.length === 0 ? <p style={{ color: "#ffffff" }}>No courses found.</p> : null}
        {courses.map((course) => (
          <CourseCard 
            key={course.id} 
            course={course} 
            isEnrolled={enrolledCourseIds.includes(course.id)} 
          />
        ))}
      </div>
    </div>
  );
}

export default Courses;