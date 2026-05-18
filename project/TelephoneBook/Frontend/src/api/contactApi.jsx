import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8080/api' });

// 요청마다 JWT 토큰 자동 주입
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 응답 시 자동 로그아웃
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export const getContacts    = (params = {}) => api.get('/contacts',              { params });
export const createContact  = (data)        => api.post('/contacts',              data);
export const updateContact  = (id, data)    => api.put(`/contacts/${id}`,         data);
export const toggleFavorite = (id)          => api.patch(`/contacts/${id}/favorite`);
export const deleteContact  = (id)          => api.delete(`/contacts/${id}`);
export const getGroups      = ()            => api.get('/groups');
export const createGroup    = (data)        => api.post('/groups',                data);
export const deleteGroup    = (id)          => api.delete(`/groups/${id}`);