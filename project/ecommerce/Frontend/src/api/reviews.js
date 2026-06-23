import client from './client';

export const getProductReviews = (productId, params) =>
  client.get(`/reviews/products/${productId}`, { params });
export const getMyReviews = (params) => client.get('/reviews/me', { params });
export const createReview = (data) => client.post('/reviews', data);
export const updateReview = (id, data) => client.put(`/reviews/${id}`, data);
export const deleteReview = (id) => client.delete(`/reviews/${id}`);
