import { Link, useLocation } from "react-router-dom";
import { courses } from "./courseData";
import { teachers } from "./TeacherName";
import "./SearchResults.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const query = useQuery().get("q") || "";
  const q = query.trim().toLowerCase();

  const courseResults = q
    ? courses.filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
    : [];

  const teacherResults = q
    ? teachers.filter((t) => t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q))
    : [];

  return (
    <div className="search-results">
      <h1>Search results for "{query}"</h1>

      <section>
        <h2>Courses</h2>
        {courseResults.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          <ul>
            {courseResults.map((c) => (
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
        {teacherResults.length === 0 ? (
          <p>No teachers found.</p>
        ) : (
          <ul>
            {teacherResults.map((t) => (
              <li key={t.id}>
                <Link to="/teacher">{t.name}</Link>
                <p>{t.subject}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default SearchResults;
