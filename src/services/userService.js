import axios from "axios";

const BASE_URL = "http://localhost:8080/api/users";

// REGISTER
export const registerUser = (user) => {
    return axios.post(BASE_URL + "/register", user);
};

// LOGIN
export const loginUser = (user) => {
    return axios.post(BASE_URL + "/login", user);
};