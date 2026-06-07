import apiClient from "./apiClient";

const enroll = (courseId, paymentMethod, paymentDetails = {}) => {
  return apiClient.post(`/api/enrollments/enroll/${courseId}`, { 
    paymentMethod,
    ...paymentDetails 
  });
};

const getMyCourses = () => {
  return apiClient.get(`/api/enrollments/my-courses`);
};

const getMyEnrollments = () => {
  return apiClient.get(`/api/enrollments/my-enrollments`);
};

const completeMaterial = (courseId, materialId) => {
  return apiClient.post(`/api/enrollments/course/${courseId}/complete/${materialId}`);
};

const enrollmentService = {
  enroll,
  getMyCourses,
  getMyEnrollments,
  completeMaterial,
};

export default enrollmentService;
