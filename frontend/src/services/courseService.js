import apiClient from "./apiClient";

const unwrapPage = (response) => response.data || { content: [] };

const fetchCourses = async (params = {}) => {
  const response = await apiClient.get("/api/courses", { params });
  return unwrapPage(response);
};

const fetchCourseById = async (id) => {
  const response = await apiClient.get(`/api/courses/${id}`);
  return response.data;
};

const courseService = {
  fetchCourses,
  fetchCourseById,
};

export default courseService;
