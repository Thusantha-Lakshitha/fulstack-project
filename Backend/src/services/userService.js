import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api/users";

// initialize axios auth header from localStorage if present
const existingToken = localStorage.getItem("token");
if (existingToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${existingToken}`;
}

// REGISTER
export const registerUser = (user) => {
    return axios.post(BASE_URL + "/register", user);
};

// LOGIN
export const loginUser = (user) => {
    return axios.post(BASE_URL + "/login", user);
};

// set or remove Authorization header and persist token
export const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        localStorage.setItem("token", token);
    } else {
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem("token");
    }
};

export const setAuthSession = ({ token, username, email }) => {
    setAuthToken(token);

    if (username) {
        localStorage.setItem("username", username);
    }

    if (email) {
        localStorage.setItem("email", email);
    }
};

export const clearAuthSession = () => {
    setAuthToken(null);
    localStorage.removeItem("username");
    localStorage.removeItem("email");
};

const userService = {
    registerUser,
    loginUser,
    setAuthToken,
    setAuthSession,
    clearAuthSession,
};

export default userService;