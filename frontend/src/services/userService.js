import axios from "axios";
import apiClient from "./apiClient";

// initialize axios auth header from localStorage if present
const existingToken = localStorage.getItem("token");
if (existingToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${existingToken}`;
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${existingToken}`;
}

// REGISTER
export const registerUser = (user) => {
    return apiClient.post(`/api/users/register`, user);
};

// LOGIN
export const loginUser = (user) => {
    return apiClient.post(`/api/users/login`, user);
};

// set or remove Authorization header and persist token
export const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        localStorage.setItem("token", token);
    } else {
        delete axios.defaults.headers.common["Authorization"];
        delete apiClient.defaults.headers.common["Authorization"];
        localStorage.removeItem("token");
    }
};

export const setAuthSession = ({ token, username, email, role }) => {
    setAuthToken(token);

    if (username) {
        localStorage.setItem("username", username);
    }

    if (email) {
        localStorage.setItem("email", email);
    }

    if (role) {
        localStorage.setItem("role", role);
    }
};

export const clearAuthSession = () => {
    setAuthToken(null);
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
};

const userService = {
    registerUser,
    loginUser,
    setAuthToken,
    setAuthSession,
    clearAuthSession,
};

export default userService;