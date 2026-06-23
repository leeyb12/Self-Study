import client from './client';

export const getMyOrders = (params) => client.get('/orders', { params });
export const getOrder = (id) => client.get(`/orders/${id}`);
export const createOrder = (data) => client.post('/orders', data);
export const cancelOrder = (id) => client.post(`/orders/${id}/cancel`);
