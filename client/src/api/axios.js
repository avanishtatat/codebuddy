import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
})

// Add a request interceptor to include the token in headers
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

// Add a response interceptor to handle errors globally
axiosInstance.interceptors.response.use(response => response, error => {
    if (error.response) {
        // Auto logout when token is invalid or expired
        if (error.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login"; 
        }
        console.error("API error response:", {
            status: error.response.status,
            data: error.response.data
        });
        return Promise.reject(error.response.data); 
    }
    return Promise.reject(error);
})

export default axiosInstance;