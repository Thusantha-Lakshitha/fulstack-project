import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import courseService from "../services/courseService";
import teacherService from "../services/teacherService";
import { subscribeDataUpdates } from "../services/liveUpdates";
import "./SearchResults.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const query = useQuery().get("q") || "";
  const q = query.trim().toLowerCase();

  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadResults = async () => {
      setLoading(true);
      setError("");

      try {
        const [coursePage, teacherPage] = await Promise.all([
          courseService.fetchCourses({ query: q, size: 100 }),
          teacherService.fetchTeachers({ query: q, size: 100 }),
        ]);

        if (active) {
          setCourses(coursePage.content || []);
          setTeachers(teacherPage.content || []);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.response?.data?.error || requestError.message || "Unable to load search results");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadResults();

    return subscribeDataUpdates(({ resource }) => {
      if (!resource || resource === "courses" || resource === "teachers") {
        loadResults();
      }
    });
  }, [q]);

  return (
    <div className="search-results">
      <h1>Search results for "{query}"</h1>

      {loading ? <p>Loading results...</p> : null}
      {error ? <p role="alert">{error}</p> : null}

      <section>
        <h2>Courses</h2>
        {!loading && !error && courses.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          <ul>
            {courses.map((c) => (
              <li key={c.id}>
                <Link to={`/course/${c.id}`}>{c.title}</Link>
                <p>{c.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Teachers</h2>
        {!loading && !error && teachers.length === 0 ? (
          <p>No teachers found.</p>
        ) : (
          <ul>
            {teachers.map((t) => (
              <li key={t.id}>
                <Link to="/teacher">{t.name}</Link>
                <p>{t.specialization}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default SearchResults;
