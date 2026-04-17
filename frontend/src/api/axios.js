import axios from 'axios';

const instance = axios.create({
  // In production, Vercel rewrites /api/* to Render.
  // In development, fallback to localhost:5000.
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;