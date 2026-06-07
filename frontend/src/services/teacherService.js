import apiClient from "./apiClient";

const unwrapPage = (response) => response.data || { content: [] };

const fetchTeachers = async (params = {}) => {
  const response = await apiClient.get("/api/teachers", { params });
  return unwrapPage(response);
};

const fetchTeacherById = async (id) => {
  const response = await apiClient.get(`/api/teachers/${id}`);
  return response.data;
};

const teacherService = {
  fetchTeachers,
  fetchTeacherById,
};

export default teacherService;
