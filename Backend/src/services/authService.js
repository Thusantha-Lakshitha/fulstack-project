import axios from "axios";

const API_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api/users";

const register = (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

const authService = {
  register,
};

export default authService;