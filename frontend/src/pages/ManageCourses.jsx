import React, { useState } from "react";
import { 
  Chip, 
  IconButton, 
  Tooltip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Stack, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TextField, 
  Alert, 
  CircularProgress,
  Box,
  Divider,
  Grid
} from "@mui/material";
import { Folder, Plus, Trash2, Edit2, PlayCircle, FileText } from "react-feather";
import AdminResourcePanel from "../components/AdminResourcePanel";
import classroomService from "../services/classroomService";
import adminService from "../services/adminService";
import { publishDataUpdate } from "../services/liveUpdates";

function ManageCourses({ onStatsRefresh }) {
  // Classroom Manager Dialog State
  const [managerOpen, setManagerOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Video Form State
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [editingVideoIndex, setEditingVideoIndex] = useState(null);
  
  // Note Form State
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteFileUrl, setNoteFileUrl] = useState("");
  const [editingNoteIndex, setEditingNoteIndex] = useState(null);

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const loadClassroomDetails = async (courseId) => {
    setLoading(true);
    setError("");
    try {
      const data = await classroomService.getClassroomData(courseId);
      setVideos(data.videos || []);
      setNotes(data.notes || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || "Failed to load classroom content");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenManager = (course) => {
    setSelectedCourse(course);
    setManagerOpen(true);
    loadClassroomDetails(course.id);
  };

  const handleCloseManager = () => {
    setManagerOpen(false);
    setSelectedCourse(null);
    setVideos([]);
    setNotes([]);
  };

  // Video Form Handlers
  const handleOpenVideoForm = (index = null) => {
    setFormError("");
    if (index !== null) {
      setEditingVideoIndex(index);
      setVideoTitle(videos[index].title);
      setVideoUrl(videos[index].url);
    } else {
      setEditingVideoIndex(null);
      setVideoTitle("");
      setVideoUrl("");
    }
    setVideoOpen(true);
  };

  const handleCloseVideoForm = () => {
    setVideoOpen(false);
    setVideoTitle("");
    setVideoUrl("");
    setEditingVideoIndex(null);
  };

  const handleSaveVideo = async (e) => {
    e.preventDefault();
    if (!videoTitle.trim() || !videoUrl.trim()) {
      setFormError("Both Video Title and Video URL are required.");
      return;
    }

    setSaving(true);
    setFormError("");

    let updatedVideos = [...videos];
    if (editingVideoIndex !== null) {
      updatedVideos[editingVideoIndex] = {
        title: videoTitle.trim(),
        url: videoUrl.trim()
      };
    } else {
      updatedVideos.push({
        title: videoTitle.trim(),
        url: videoUrl.trim()
      });
    }

    try {
      await adminService.updateResource("courses", selectedCourse.id, {
        videos: updatedVideos
      });
      setVideos(updatedVideos);
      handleCloseVideoForm();
      if (onStatsRefresh) onStatsRefresh();
      publishDataUpdate("courses");
    } catch (err) {
      setFormError(err.response?.data?.error || err.message || "Failed to save video.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteVideo = async (index) => {
    if (!window.confirm("Are you sure you want to delete this video?")) {
      return;
    }

    setLoading(true);
    setError("");

    const updatedVideos = videos.filter((_, idx) => idx !== index);

    try {
      await adminService.updateResource("courses", selectedCourse.id, {
        videos: updatedVideos
      });
      setVideos(updatedVideos);
      if (onStatsRefresh) onStatsRefresh();
      publishDataUpdate("courses");
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to delete video.");
    } finally {
      setLoading(false);
    }
  };

  // Note Form Handlers
  const handleOpenNoteForm = (index = null) => {
    setFormError("");
    if (index !== null) {
      setEditingNoteIndex(index);
      setNoteTitle(notes[index].title);
      setNoteFileUrl(notes[index].fileUrl);
    } else {
      setEditingNoteIndex(null);
      setNoteTitle("");
      setNoteFileUrl("");
    }
    setNoteOpen(true);
  };

  const handleCloseNoteForm = () => {
    setNoteOpen(false);
    setNoteTitle("");
    setNoteFileUrl("");
    setEditingNoteIndex(null);
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteFileUrl.trim()) {
      setFormError("Both Notes Title and Notes File URL are required.");
      return;
    }

    setSaving(true);
    setFormError("");

    let updatedNotes = [...notes];
    if (editingNoteIndex !== null) {
      updatedNotes[editingNoteIndex] = {
        title: noteTitle.trim(),
        fileUrl: noteFileUrl.trim()
      };
    } else {
      updatedNotes.push({
        title: noteTitle.trim(),
        fileUrl: noteFileUrl.trim()
      });
    }

    try {
      await adminService.updateResource("courses", selectedCourse.id, {
        notes: updatedNotes
      });
      setNotes(updatedNotes);
      handleCloseNoteForm();
      if (onStatsRefresh) onStatsRefresh();
      publishDataUpdate("courses");
    } catch (err) {
      setFormError(err.response?.data?.error || err.message || "Failed to save note.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (index) => {
    if (!window.confirm("Are you sure you want to delete this study note?")) {
      return;
    }

    setLoading(true);
    setError("");

    const updatedNotes = notes.filter((_, idx) => idx !== index);

    try {
      await adminService.updateResource("courses", selectedCourse.id, {
        notes: updatedNotes
      });
      setNotes(updatedNotes);
      if (onStatsRefresh) onStatsRefresh();
      publishDataUpdate("courses");
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to delete note.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminResourcePanel
        title="Courses"
        resource="courses"
        statsLabel="courses"
        onStatsRefresh={onStatsRefresh}
        description="Maintain the catalog, pricing, difficulty level, and assigned instructor for each course."
        columns={[
          { key: "title", label: "Title" },
          { key: "category", label: "Category" },
          { key: "instructorName", label: "Instructor" },
          { key: "price", label: "Price" },
          {
            key: "level",
            label: "Level",
            render: (row) => <Chip size="small" label={(row.level || "BEGINNER").toUpperCase()} color="primary" variant="outlined" />,
          },
        ]}
        fields={[
          { name: "title", label: "Course Title" },
          { name: "description", label: "Description", type: "textarea", fullWidth: true, rows: 4, required: false },
          { name: "imageUrl", label: "Thumbnail URL", required: false },
          { name: "category", label: "Category" },
          { name: "instructorName", label: "Instructor Name" },
          { name: "price", label: "Price", type: "number" },
          { name: "duration", label: "Duration" },
          {
            name: "level",
            label: "Level",
            type: "select",
            options: [
              { label: "Beginner", value: "BEGINNER" },
              { label: "Intermediate", value: "INTERMEDIATE" },
              { label: "Advanced", value: "ADVANCED" },
            ],
          },
          { name: "seatsAvailable", label: "Seats Available", type: "number" },
        ]}
        defaultValues={{ level: "BEGINNER", seatsAvailable: 0 }}
        renderRowActions={(row) => (
          <Tooltip title="Manage Classroom Content">
            <IconButton color="secondary" onClick={() => handleOpenManager(row)}>
              <Folder size={16} />
            </IconButton>
          </Tooltip>
        )}
      />

      {/* Classroom Manager Dialog */}
      <Dialog open={managerOpen} onClose={handleCloseManager} fullWidth maxWidth="lg">
        <DialogTitle sx={{ fontWeight: 800 }}>
          Classroom Content Manager: {selectedCourse?.title}
        </DialogTitle>
        <DialogContent dividers>
          {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
          
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {/* Videos Section */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
                      <PlayCircle size={18} /> Course Videos ({videos.length})
                    </Typography>
                    <Button 
                      variant="contained" 
                      size="small" 
                      startIcon={<Plus size={16} />}
                      onClick={() => handleOpenVideoForm()}
                      sx={{ textTransform: "none", fontWeight: 700 }}
                    >
                      Add Video
                    </Button>
                  </Box>
                  <Divider />
                  
                  {videos.length > 0 ? (
                    <TableContainer component={Paper} elevation={0} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>URL</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {videos.map((vid, idx) => (
                            <TableRow key={idx} hover>
                              <TableCell sx={{ fontWeight: 600 }}>{vid.title}</TableCell>
                              <TableCell sx={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {vid.url}
                              </TableCell>
                              <TableCell align="right">
                                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                  <IconButton color="primary" size="small" onClick={() => handleOpenVideoForm(idx)}>
                                    <Edit2 size={12} />
                                  </IconButton>
                                  <IconButton color="error" size="small" onClick={() => handleDeleteVideo(idx)}>
                                    <Trash2 size={12} />
                                  </IconButton>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                      No videos uploaded for this course yet.
                    </Typography>
                  )}
                </Stack>
              </Grid>

              {/* Notes Section */}
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
                      <FileText size={18} /> Course Notes ({notes.length})
                    </Typography>
                    <Button 
                      variant="contained" 
                      size="small" 
                      startIcon={<Plus size={16} />}
                      onClick={() => handleOpenNoteForm()}
                      sx={{ textTransform: "none", fontWeight: 700 }}
                    >
                      Add Note
                    </Button>
                  </Box>
                  <Divider />

                  {notes.length > 0 ? (
                    <TableContainer component={Paper} elevation={0} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>File URL</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {notes.map((note, idx) => (
                            <TableRow key={idx} hover>
                              <TableCell sx={{ fontWeight: 600 }}>{note.title}</TableCell>
                              <TableCell sx={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {note.fileUrl}
                              </TableCell>
                              <TableCell align="right">
                                <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                  <IconButton color="primary" size="small" onClick={() => handleOpenNoteForm(idx)}>
                                    <Edit2 size={12} />
                                  </IconButton>
                                  <IconButton color="error" size="small" onClick={() => handleDeleteNote(idx)}>
                                    <Trash2 size={12} />
                                  </IconButton>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                      No study notes uploaded for this course yet.
                    </Typography>
                  )}
                </Stack>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleCloseManager} variant="outlined" sx={{ textTransform: "none" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Video Form Dialog */}
      <Dialog open={videoOpen} onClose={handleCloseVideoForm} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingVideoIndex !== null ? "Edit Video Info" : "Add Video"}
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleSaveVideo} sx={{ pt: 1 }}>
            <Stack spacing={2}>
              {formError ? <Alert severity="error">{formError}</Alert> : null}
              <TextField
                fullWidth
                label="Video Title"
                placeholder="e.g. Introduction & Setup"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Video URL"
                placeholder="e.g. https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseVideoForm} color="inherit" disabled={saving} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveVideo} 
            variant="contained" 
            disabled={saving}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            {saving ? "Saving..." : "Save Video"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Note Form Dialog */}
      <Dialog open={noteOpen} onClose={handleCloseNoteForm} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800 }}>
          {editingNoteIndex !== null ? "Edit Note Info" : "Add Note"}
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleSaveNote} sx={{ pt: 1 }}>
            <Stack spacing={2}>
              {formError ? <Alert severity="error">{formError}</Alert> : null}
              <TextField
                fullWidth
                label="Notes Title"
                placeholder="e.g. Chapter 1 PDF notes"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Notes File URL"
                placeholder="e.g. https://my-bucket.s3.amazonaws.com/notes.pdf"
                value={noteFileUrl}
                onChange={(e) => setNoteFileUrl(e.target.value)}
                required
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseNoteForm} color="inherit" disabled={saving} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveNote} 
            variant="contained" 
            disabled={saving}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            {saving ? "Saving..." : "Save Note"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ManageCourses;