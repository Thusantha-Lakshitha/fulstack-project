import { useState } from "react";

function ManageCourses() {

  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "React JS",
      price: "LKR 7000",
    },
  ]);

  const addCourse = () => {
    const newCourse = {
      id: courses.length + 1,
      title: "New Course",
      price: "LKR 5000",
    };

    setCourses([...courses, newCourse]);
  };

  const deleteCourse = (id) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  return (
    <div style={{ padding: "40px" }}>

      <h1>Manage Courses</h1>

      <button onClick={addCourse}>
        Add Course
      </button>

      {courses.map((course) => (
        <div key={course.id}>

          <h3>{course.title}</h3>
          <p>{course.price}</p>

          <button onClick={() => deleteCourse(course.id)}>
            Remove
          </button>

        </div>
      ))}

    </div>
  );
}

export default ManageCourses;