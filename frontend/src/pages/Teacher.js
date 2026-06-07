import "./Teacher.css";
import { useEffect, useState } from "react";
import teacherService from "../services/teacherService";
import { subscribeDataUpdates } from "../services/liveUpdates";

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTeachers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await teacherService.fetchTeachers({ size: 100 });
      setTeachers(response.content || []);
    } catch (requestError) {
      setError(requestError.response?.data?.error || requestError.message || "Unable to load teachers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();

    return subscribeDataUpdates(({ resource }) => {
      if (!resource || resource === "teachers") {
        loadTeachers();
      }
    });
  }, []);

  return (
    <div className="teachers">
      <h1>Our Teachers</h1>

      {loading ? <p>Loading teachers...</p> : null}
      {error ? <p role="alert">{error}</p> : null}

      <div className="teacher-container">
        {!loading && !error && teachers.length === 0 ? <p>No teachers found.</p> : null}
        {teachers.map((teacher) => (
          <div className="teacher-card" key={teacher.id}>
            <div className="avatar">👨‍🏫</div>

            <h3>{teacher.name}</h3>
            <p>Subject: {teacher.specialization || "General"}</p>
            <p>Experience: {teacher.experienceYears ?? 0} Years</p>
            <p>Status: {(teacher.status || "ACTIVE").toUpperCase()}</p>

            
          </div>
        ))}
      </div>
    </div>
  );
}

export default Teachers;