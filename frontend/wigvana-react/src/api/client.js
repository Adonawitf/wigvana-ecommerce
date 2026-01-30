import axios from 'axios';

const client = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // For cookie-based auth (refresh token)
});

// Request interceptor to add the access token to headers
client.interceptors.request.use(
    (config) => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                if (user.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
            } catch (error) {
                console.error("Error parsing user from localStorage", error);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle 401 (Unauthorized) errors globally
client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Optional: Auto-logout or redirect to login if session expires
            // window.location.href = '/login'; 
            // Ensure we don't clear storage blindly as this might happen during valid session checks
        }
        return Promise.reject(error);
    }
);

export default client;
