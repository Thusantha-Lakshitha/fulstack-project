import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Play, 
  BookOpen, 
  Download, 
  ArrowLeft,
  Loader,
  AlertCircle,
  Video,
  FileText
} from "react-feather";
import classroomService from "../services/classroomService";
import "./Classroom.css";

function Classroom() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [classroomData, setClassroomData] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notEnrolled, setNotEnrolled] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      setNotEnrolled(false);
      try {
        const data = await classroomService.getClassroomData(courseId);
        setClassroomData(data);
        if (data.videos && data.videos.length > 0) {
          setActiveVideo(data.videos[0]);
        }
      } catch (err) {
        console.error("Error loading classroom data", err);
        if (err.response?.status === 403) {
          setNotEnrolled(true);
          setError("You must enroll in this course to access classroom content.");
        } else if (err.response?.status === 401) {
          navigate("/login", { state: { message: "Please log in to access the classroom." } });
        } else {
          setError(err.response?.data?.error || err.response?.data?.message || "Failed to load classroom details.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [courseId, navigate]);

  const getEmbedUrl = (url) => {
    if (!url) return null;
    
    // YouTube matches
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i);
    if (ytMatch) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
    
    // Vimeo matches
    const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/i);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="classroom-loading">
        <Loader className="spinner" size={48} />
        <h2>Loading Classroom Content...</h2>
      </div>
    );
  }

  if (notEnrolled) {
    return (
      <div className="classroom-auth-error">
        <div className="error-card">
          <AlertCircle className="error-icon" size={64} />
          <h1>Access Denied</h1>
          <p className="error-message">
            You must enroll in this course to access classroom content.
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

  if (error || !classroomData) {
    return (
      <div className="classroom-error">
        <div className="error-card">
          <AlertCircle className="error-icon" size={64} />
          <h1>Error</h1>
          <p>{error || "Course classroom data could not be retrieved."}</p>
          <button className="btn-secondary" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { courseTitle, videos = [], notes = [] } = classroomData;
  const embedUrl = activeVideo ? getEmbedUrl(activeVideo.url) : null;

  return (
    <div className="classroom-layout">
      {/* Sidebar with videos list */}
      <aside className="classroom-sidebar">
        <div className="sidebar-header">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </button>
          <h2>{courseTitle}</h2>
        </div>

        <nav className="video-nav">
          <h3>Videos ({videos.length})</h3>
          {videos.length > 0 ? (
            <ul className="video-playlist">
              {videos.map((vid, index) => (
                <li 
                  key={index} 
                  className={`video-playlist-item ${activeVideo?.url === vid.url ? "active" : ""}`}
                  onClick={() => setActiveVideo(vid)}
                >
                  <div className="video-item-content">
                    <span className="video-index">{index + 1}.</span>
                    <span className="video-title" title={vid.title}>{vid.title}</span>
                  </div>
                  <Play size={14} className="play-icon-indicator" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-items-placeholder">No classroom videos uploaded.</p>
          )}
        </nav>
      </aside>

      {/* Main video player and notes section */}
      <main className="classroom-main">
        {activeVideo ? (
          <div className="player-container">
            <h1 className="active-video-title">{activeVideo.title}</h1>
            <div className="video-player-wrapper">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={activeVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="video-player-iframe"
                ></iframe>
              ) : (
                <video 
                  key={activeVideo.url} // Force re-render on active video change
                  controls
                  controlsList="nodownload"
                  className="video-player-element"
                  src={activeVideo.url}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        ) : (
          <div className="classroom-empty-video">
            <Video size={64} className="placeholder-icon" />
            <h2>No Video Selected</h2>
            <p>Select a video lecture from the sidebar playlist to begin learning.</p>
          </div>
        )}

        {/* Notes Section */}
        <section className="notes-section-container">
          <div className="notes-header">
            <BookOpen size={20} className="header-icon" />
            <h2>Course Notes & Study Materials ({notes.length})</h2>
          </div>

          {notes.length > 0 ? (
            <div className="notes-grid">
              {notes.map((note, idx) => (
                <div key={idx} className="note-card">
                  <div className="note-card-info">
                    <FileText size={24} className="note-icon" />
                    <div className="note-text-wrapper">
                      <h4 className="note-title">{note.title}</h4>
                      <p className="note-meta">Attachment {idx + 1}</p>
                    </div>
                  </div>
                  <a
                    href={note.fileUrl}
                    download={note.title || "notes.pdf"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-download-note"
                  >
                    <Download size={16} />
                    <span>Download Notes</span>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-notes-placeholder">
              <FileText size={40} className="placeholder-icon" />
              <p>No reference notes are available for this course yet.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Classroom;
