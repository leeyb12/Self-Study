import axios from 'axios';

const BASE = 'http://localhost:8080/api/auth';

export const signup = (data) => axios.post(`${BASE}/signup`, data);
export const login  = (data) => axios.post(`${BASE}/login`,  data);