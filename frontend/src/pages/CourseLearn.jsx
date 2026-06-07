import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Play, 
  BookOpen, 
  Download, 
  CheckCircle, 
  ArrowLeft,
  Loader,
  AlertCircle
} from "react-feather";
import courseService from "../services/courseService";
import enrollmentService from "../services/enrollmentService";
import learningMaterialsService from "../services/learningMaterialsService";
import "./CourseLearn.css";

function CourseLearn() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [activeMaterial, setActiveMaterial] = useState(null);
  const [enrollment, setEnrollment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    const loadClassroom = async () => {
      setLoading(true);
      setError("");
      setAuthError(false);

      try {
        // 1. Fetch course details
        const courseData = await courseService.fetchCourseById(courseId);
        setCourse(courseData);

        // 2. Fetch enrollment info to get completed status
        const enrollmentsRes = await enrollmentService.getMyEnrollments();
        const activeEnrollment = (enrollmentsRes.data || []).find(
          (e) => e.courseId === courseId
        );
        
        if (!activeEnrollment) {
          // If no enrollment is found and role is not ADMIN, show access block
          const role = (localStorage.getItem("role") || "").toUpperCase();
          if (role !== "ADMIN") {
            setAuthError(true);
            setLoading(false);
            return;
          }
        }
        setEnrollment(activeEnrollment);

        // 3. Fetch materials
        const materialsRes = await learningMaterialsService.fetchCourseMaterials(courseId);
        const materialsData = materialsRes.data || [];
        setMaterials(materialsData);

        if (materialsData.length > 0) {
          setActiveMaterial(materialsData[0]);
        }
      } catch (err) {
        if (err.response?.status === 403) {
          setAuthError(true);
        } else if (err.response?.status === 401) {
          navigate("/login", { state: { message: "Please log in to access your course." } });
        } else {
          setError(err.response?.data?.error || err.message || "Failed to load classroom");
        }
      } finally {
        setLoading(false);
      }
    };

    loadClassroom();
  }, [courseId, navigate]);

  const handleToggleComplete = async (materialId) => {
    try {
      const res = await enrollmentService.completeMaterial(courseId, materialId);
      setEnrollment(res.data);
    } catch (err) {
      console.error("Failed to toggle lesson completion status", err);
    }
  };

  if (loading) {
    return (
      <div className="classroom-loading">
        <Loader className="spinner" size={48} />
        <h2>Loading secure classroom...</h2>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="classroom-auth-error">
        <div className="error-card">
          <AlertCircle className="error-icon" size={64} />
          <h1>Access Blocked</h1>
          <p className="error-message">
            Please enroll in this course to access learning materials.
          </p>
          <div className="error-actions">
            <Link to={`/courses/${courseId}`} className="btn-primary">
              View Course Details
            </Link>
            <Link to="/course" className="btn-secondary">
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="classroom-error">
        <div className="error-card">
          <AlertCircle className="error-icon" size={64} />
          <h1>Error Loading Classroom</h1>
          <p>{error || "Course not found."}</p>
          <Link to="/dashboard" className="btn-secondary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const isCompleted = (materialId) => {
    return enrollment?.completedMaterialIds?.includes(materialId) || false;
  };

  return (
    <div className="classroom-layout">
      {/* Sidebar with lessons */}
      <aside className="classroom-sidebar">
        <div className="sidebar-header">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>
          <h2>{course.title}</h2>
          {enrollment && (
            <div className="progress-container">
              <div className="progress-bar-wrapper">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${enrollment.progressPercentage}%` }}
                ></div>
              </div>
              <span className="progress-label">
                {enrollment.progressPercentage}% Completed
              </span>
            </div>
          )}
        </div>

        <nav className="lesson-nav">
          <h3>Course Content</h3>
          {materials.length > 0 ? (
            <ul>
              {materials.map((m, index) => (
                <li 
                  key={m.id} 
                  className={`lesson-item ${activeMaterial?.id === m.id ? "active" : ""}`}
                  onClick={() => setActiveMaterial(m)}
                >
                  <div className="lesson-left">
                    <button 
                      className={`complete-checkbox ${isCompleted(m.id) ? "checked" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleComplete(m.id);
                      }}
                      title={isCompleted(m.id) ? "Mark incomplete" : "Mark completed"}
                    >
                      {isCompleted(m.id) && <CheckCircle size={14} />}
                    </button>
                    <span className="lesson-index">{index + 1}.</span>
                    <span className="lesson-title">{m.title}</span>
                  </div>
                  <div className="lesson-icon-indicator">
                    {m.videoPath && <Play size={12} className="video-icon" />}
                    {m.notesPath && <BookOpen size={12} className="pdf-icon" />}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-lessons">No lessons uploaded yet.</p>
          )}
        </nav>
      </aside>

      {/* Main learning player content */}
      <main className="classroom-main">
        {activeMaterial ? (
          <div className="material-container">
            <h1 className="material-title">{activeMaterial.title}</h1>
            {activeMaterial.description && (
              <p className="material-description">{activeMaterial.description}</p>
            )}

            {/* Secure Video Player */}
            {activeMaterial.videoPath ? (
              <div className="video-wrapper">
                <video 
                  key={activeMaterial.id} // Forces re-render on lesson switch
                  controls
                  controlsList="nodownload" // Protect video copy
                  className="video-player"
                  src={learningMaterialsService.getVideoUrl(activeMaterial.id)}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="no-video-placeholder">
                <Play size={48} className="placeholder-icon" />
                <p>No video lecture uploaded for this lesson.</p>
              </div>
            )}

            {/* Secure Note Downloads */}
            {activeMaterial.notesPath ? (
              <div className="notes-section">
                <div className="notes-card">
                  <BookOpen size={24} className="notes-icon" />
                  <div className="notes-info">
                    <h4>Lecture Notes & Materials</h4>
                    <p>{activeMaterial.notesOriginalName || "notes.pdf"}</p>
                  </div>
                  <a 
                    href={learningMaterialsService.getNotesDownloadUrl(activeMaterial.id)}
                    download={activeMaterial.notesOriginalName || "notes.pdf"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-download"
                  >
                    <Download size={16} />
                    <span>Download Notes</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="notes-section">
                <div className="notes-card empty">
                  <BookOpen size={24} className="notes-icon" />
                  <div className="notes-info">
                    <h4>No Lecture Notes Available</h4>
                    <p>No additional reading documents uploaded for this lesson.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="classroom-empty-state">
            <BookOpen size={64} className="empty-icon" />
            <h2>Welcome to Classroom!</h2>
            <p>Select a lesson from the sidebar content outline to start learning.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default CourseLearn;
