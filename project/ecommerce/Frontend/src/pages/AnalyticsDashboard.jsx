import { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, FunnelChart, Funnel, LabelList,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts';
import {
  getTopViewed, getTopPurchased, getTopKeywords, getDailyPurchase, getFunnel,
} from '../api/analytics';

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe', '#7c3aed', '#5b21b6', '#4c1d95', '#2e1065'];

const now = new Date();
const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

export default function AnalyticsDashboard() {
  const [topViewed, setTopViewed] = useState([]);
  const [topPurchased, setTopPurchased] = useState([]);
  const [topKeywords, setTopKeywords] = useState([]);
  const [dailyPurchase, setDailyPurchase] = useState([]);
  const [funnel, setFunnel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getTopViewed(thirtyDaysAgo, now).then((r) => setTopViewed(r.data || [])),
      getTopPurchased(thirtyDaysAgo, now).then((r) => setTopPurchased(r.data || [])),
      getTopKeywords(thirtyDaysAgo, now).then((r) => setTopKeywords(r.data || [])),
      getDailyPurchase(thirtyDaysAgo, now).then((r) => setDailyPurchase(r.data || [])),
      getFunnel(thirtyDaysAgo, now).then((r) => setFunnel(r.data)),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading page">데이터 불러오는 중...</div>;

  const funnelData = funnel
    ? [
        { name: '상품 조회', value: Number(funnel.viewCount) },
        { name: '장바구니 담기', value: Number(funnel.cartAddCount) },
        { name: '구매 완료', value: Number(funnel.purchaseCount) },
      ]
    : [];

  return (
    <div className="page">
      <h1 className="page-title">구매 행동 분석 대시보드</h1>
      <p className="dashboard-period">분석 기간: 최근 30일</p>

      {funnel && (
        <div className="dashboard-row">
          <div className="chart-card chart-card--wide">
            <h2 className="chart-title">구매 전환 퍼널</h2>
            <div className="funnel-stats">
              <div className="funnel-stat">
                <div className="funnel-stat-value">{funnel.viewCount?.toLocaleString()}</div>
                <div className="funnel-stat-label">상품 조회</div>
              </div>
              <div className="funnel-arrow">→</div>
              <div className="funnel-stat">
                <div className="funnel-stat-value">{funnel.cartAddCount?.toLocaleString()}</div>
                <div className="funnel-stat-label">장바구니 ({funnel.cartConversionRate?.toFixed(1)}%)</div>
              </div>
              <div className="funnel-arrow">→</div>
              <div className="funnel-stat funnel-stat--highlight">
                <div className="funnel-stat-value">{funnel.purchaseCount?.toLocaleString()}</div>
                <div className="funnel-stat-label">구매 ({funnel.purchaseConversionRate?.toFixed(1)}%)</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={funnelData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 6, 6, 0]}>
                  {funnelData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="dashboard-row">
        <div className="chart-card">
          <h2 className="chart-title">일별 구매 추이</h2>
          {dailyPurchase.length === 0 ? (
            <p className="empty">데이터 없음</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dailyPurchase.map((d) => ({ date: d.date?.slice(5), count: Number(d.count) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={false} name="구매 수" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="chart-card">
          <h2 className="chart-title">인기 검색어 TOP 10</h2>
          {topKeywords.length === 0 ? (
            <p className="empty">데이터 없음</p>
          ) : (
            <div className="keyword-list">
              {topKeywords.map((k, i) => (
                <div key={k.keyword} className="keyword-item">
                  <span className="keyword-rank">{i + 1}</span>
                  <span className="keyword-text">{k.keyword}</span>
                  <span className="keyword-count">{k.count?.toLocaleString()}회</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-row">
        <div className="chart-card">
          <h2 className="chart-title">많이 본 상품 TOP 10</h2>
          {topViewed.length === 0 ? (
            <p className="empty">데이터 없음</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topViewed.map((p) => ({ id: `#${p.productId}`, count: Number(p.count) }))} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="id" width={55} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" name="조회 수" radius={[0, 4, 4, 0]}>
                  {topViewed.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="chart-card">
          <h2 className="chart-title">많이 팔린 상품 TOP 10</h2>
          {topPurchased.length === 0 ? (
            <p className="empty">데이터 없음</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topPurchased.map((p) => ({ id: `#${p.productId}`, count: Number(p.count) }))} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="id" width={55} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" name="판매 수" radius={[0, 4, 4, 0]}>
                  {topPurchased.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
