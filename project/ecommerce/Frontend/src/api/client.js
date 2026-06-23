import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(err.response?.data || err);
  }
);

export default client;
