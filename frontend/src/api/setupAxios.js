import axios from "axios";

// Vite exposes env variables prefixed with VITE_.
// If VITE_BACKEND_URL is not provided, fall back to the local backend path used in this project.
const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api/v1/users";

const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;