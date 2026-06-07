import React from "react";
import { useNavigate } from "react-router-dom";
import "./CourseCard.css";

function CourseCard({ course, isEnrolled }) {
  const navigate = useNavigate();
  
  // High-quality premium default placeholder
  const thumbnail = course.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60";

  return (
    <div className="course-card">
      <div className="course-card-image-wrapper">
        <img src={thumbnail} alt={course.title} className="course-card-image" />
      </div>
      
      <div className="course-card-content">
        <h3 className="course-card-title">{course.title}</h3>
        <p className="course-card-instructor">
          <strong>Instructor:</strong> {course.instructorName || "TBA"}
        </p>
        
        <div className="course-card-actions">
          {isEnrolled ? (
            <button 
              className="course-card-btn btn-classroom" 
              onClick={() => navigate(`/classroom/${course.id}`)}
            >
              Go To Classroom
            </button>
          ) : (
            <button 
              className="course-card-btn btn-enroll" 
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              Enroll Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
