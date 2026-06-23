import client from './client';

export const getProducts = (params) => client.get('/products', { params });
export const getProduct = (id) => client.get(`/products/${id}`);
export const searchProducts = (keyword, params) =>
  client.get('/products/search', { params: { keyword, ...params } });
export const getByCategory = (categoryId, params) =>
  client.get(`/products/category/${categoryId}`, { params });

export const createProduct = (data) => client.post('/products', data);
export const updateProduct = (id, data) => client.put(`/products/${id}`, data);
export const hideProduct = (id) => client.patch(`/products/${id}/hide`);
export const showProduct = (id) => client.patch(`/products/${id}/show`);
