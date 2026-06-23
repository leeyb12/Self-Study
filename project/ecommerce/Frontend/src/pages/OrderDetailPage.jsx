import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder, cancelOrder } from '../api/orders';

const STATUS_STEPS = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED'];
const STATUS_LABELS = { PENDING: '주문 대기', PAID: '결제 완료', SHIPPED: '배송 중', DELIVERED: '배송 완료', CANCELLED: '취소됨' };

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getOrder(id).then((res) => setOrder(res.data));
  }, [id]);

  const handleCancel = async () => {
    if (!confirm('주문을 취소하시겠습니까?')) return;
    try {
      await cancelOrder(id);
      getOrder(id).then((res) => setOrder(res.data));
    } catch (e) {
      alert(e.message || '취소할 수 없는 주문입니다.');
    }
  };

  if (!order) return <div className="loading page">불러오는 중...</div>;

  const stepIndex = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="page">
      <button className="btn btn--sm btn--outline back-btn" onClick={() => navigate('/orders')}>← 목록으로</button>
      <h1 className="page-title">주문 상세 #{order.orderId}</h1>

      {!isCancelled ? (
        <div className="order-steps">
          {STATUS_STEPS.map((step, i) => (
            <div key={step} className={`order-step ${i <= stepIndex ? 'order-step--done' : ''}`}>
              <div className="order-step-dot">{i <= stepIndex ? '✓' : i + 1}</div>
              <span>{STATUS_LABELS[step]}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="badge badge--gray badge--lg">취소된 주문</div>
      )}

      <div className="order-detail-grid">
        <div className="order-detail-box">
          <h2 className="section-title">배송 정보</h2>
          <p><strong>배송지:</strong> {order.deliveryAddr}</p>
          <p><strong>결제 수단:</strong> {order.paymentMethod}</p>
          <p><strong>주문일:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        </div>

        <div className="order-detail-box">
          <h2 className="section-title">주문 상품</h2>
          {order.items?.map((item) => (
            <div key={item.orderItemId} className="summary-item">
              <span>{item.productName} x{item.quantity}</span>
              <span>{item.totalItemPrice?.toLocaleString()}원</span>
            </div>
          ))}
          <div className="summary-total">
            <strong>합계</strong>
            <strong>{order.totalPrice?.toLocaleString()}원</strong>
          </div>
        </div>
      </div>

      {(order.status === 'PENDING' || order.status === 'PAID') && (
        <button className="btn btn--danger" onClick={handleCancel}>주문 취소</button>
      )}
    </div>
  );
}
