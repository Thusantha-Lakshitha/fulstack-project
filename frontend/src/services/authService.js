import apiClient from "./apiClient";

const register = (userData) => {
  return apiClient.post(`/api/users/register`, userData);
};

const authService = {
  register,
};

export default authService;