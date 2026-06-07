import "./Teacher.css";
import { teachers } from "./TeacherName";

function Teachers() {
  return (
    <div className="teachers">
      <h1>Our Teachers</h1>

      <div className="teacher-container">
        {teachers.map((teacher) => (
          <div className="teacher-card" key={teacher.id}>
            <div className="avatar">👨‍🏫</div>

            <h3>{teacher.name}</h3>
            <p>Subject: {teacher.subject}</p>
            <p>Experience: {teacher.experience}</p>

            
          </div>
        ))}
      </div>
    </div>
  );
}

export default Teachers;