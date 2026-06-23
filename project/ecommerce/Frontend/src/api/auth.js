import client from './client';

export const signup = (data) => client.post('/members/signup', data);
export const login = (data) => client.post('/members/login', data);
export const getMyInfo = () => client.get('/members/me');
export const updateProfile = (data) => client.put('/members/me', data);
export const withdraw = () => client.delete('/members/me');
