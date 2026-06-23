import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../api/orders';
import Pagination from '../components/Pagination';

const STATUS_LABELS = {
  PENDING: '주문 대기',
  PAID: '결제 완료',
  SHIPPED: '배송 중',
  DELIVERED: '배송 완료',
  CANCELLED: '취소됨',
};

const STATUS_COLORS = {
  PENDING: 'badge--yellow',
  PAID: 'badge--blue',
  SHIPPED: 'badge--purple',
  DELIVERED: 'badge--green',
  CANCELLED: 'badge--gray',
};

export default function OrderListPage() {
  const [orders, setOrders] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const load = (page = 0) => {
    setLoading(true);
    getMyOrders({ page, size: 10 })
      .then((res) => {
        setOrders(res.data?.content || []);
        setPageInfo({ page: res.data?.page ?? 0, totalPages: res.data?.totalPages ?? 1 });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="loading page">불러오는 중...</div>;

  return (
    <div className="page">
      <h1 className="page-title">주문 내역</h1>
      {orders.length === 0 ? (
        <div className="empty">주문 내역이 없습니다.</div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <Link key={order.orderId} to={`/orders/${order.orderId}`} className="order-card">
              <div className="order-card-header">
                <span className="order-id">주문번호 #{order.orderId}</span>
                <span className={`badge ${STATUS_COLORS[order.status]}`}>{STATUS_LABELS[order.status]}</span>
              </div>
              <div className="order-card-body">
                <p>{order.items?.map((i) => i.productName).join(', ')}</p>
                <p className="order-card-total">{order.totalPrice?.toLocaleString()}원</p>
              </div>
              <div className="order-card-footer">
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                <span className="order-card-arrow">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
      <Pagination page={pageInfo.page} totalPages={pageInfo.totalPages} onPageChange={load} />
    </div>
  );
}
