import { useNavigate } from 'react-router-dom';
import axios from 'axios';
/**
 * Custom hook to get the configured Axios instance.
 * @returns {import('axios').AxiosInstance} The configured Axios instance.
 */
const useAxios = () => {
    const navigate = useNavigate();
    const axiosInstance = axios.create({
        baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    });

    axiosInstance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("auth_token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        (response) => {
            return response.data;
        },
        (error) => {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                localStorage.removeItem("auth_token");
                localStorage.removeItem("user_role");
                navigate('/login');
            }
            return Promise.reject(error);
        }
    );
    return axiosInstance;
};

export default useAxios; 