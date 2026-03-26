import axios from 'axios';
import { getAccessToken } from './tokenService';

const api = axios.create({
  baseURL: 'https://localhost:7020/api/', 
});

api.interceptors.request.use(
  async (config) => {
    const accessToken = await getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
