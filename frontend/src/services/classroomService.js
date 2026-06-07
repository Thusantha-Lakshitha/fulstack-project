import apiClient from "./apiClient";

const getClassroomData = async (courseId) => {
  const response = await apiClient.get(`/api/classroom/${courseId}`);
  return response.data;
};

const classroomService = {
  getClassroomData,
};

export default classroomService;
