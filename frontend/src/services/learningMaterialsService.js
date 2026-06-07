import apiClient from "./apiClient";

const fetchCourseMaterials = (courseId) => {
  return apiClient.get(`/api/learning-materials/course/${courseId}`);
};

const uploadMaterial = (formData) => {
  return apiClient.post(`/api/admin/learning-materials`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const updateMaterial = (id, formData) => {
  return apiClient.put(`/api/admin/learning-materials/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const deleteMaterial = (id) => {
  return apiClient.delete(`/api/admin/learning-materials/${id}`);
};

const getVideoUrl = (id) => {
  const token = localStorage.getItem("token") || "";
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
  return `${API_BASE_URL}/api/learning-materials/${id}/video?token=${encodeURIComponent(token)}`;
};

const getNotesDownloadUrl = (id) => {
  const token = localStorage.getItem("token") || "";
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
  return `${API_BASE_URL}/api/learning-materials/${id}/notes?token=${encodeURIComponent(token)}`;
};

const learningMaterialsService = {
  fetchCourseMaterials,
  uploadMaterial,
  updateMaterial,
  deleteMaterial,
  getVideoUrl,
  getNotesDownloadUrl,
};

export default learningMaterialsService;
