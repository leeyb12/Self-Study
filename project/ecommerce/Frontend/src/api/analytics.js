import client from './client';

const fmt = (dt) => dt.toISOString();

export const logBehavior = (data) => client.post('/analytics/log', data);
export const getTopViewed = (start, end, limit = 10) =>
  client.get('/analytics/top-viewed', { params: { start: fmt(start), end: fmt(end), limit } });
export const getTopPurchased = (start, end, limit = 10) =>
  client.get('/analytics/top-purchased', { params: { start: fmt(start), end: fmt(end), limit } });
export const getTopKeywords = (start, end, limit = 10) =>
  client.get('/analytics/top-keywords', { params: { start: fmt(start), end: fmt(end), limit } });
export const getDailyPurchase = (start, end) =>
  client.get('/analytics/daily-purchase', { params: { start: fmt(start), end: fmt(end) } });
export const getFunnel = (start, end) =>
  client.get('/analytics/funnel', { params: { start: fmt(start), end: fmt(end) } });
export const getMyBehaviorSummary = () => client.get('/analytics/members/me/summary');
