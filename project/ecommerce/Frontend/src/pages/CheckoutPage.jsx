import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createOrder } from '../api/orders';
import { clearCart } from '../api/cart';
import { useState } from 'react';
import useAuthStore from '../store/authStore';

const PAYMENT_METHODS = ['카드', '계좌이체', '카카오페이', '네이버페이'];

export default function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const cart = state?.cart;
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { paymentMethod: '카드' },
  });

  if (!cart || !cart.items?.length) {
    return (
      <div className="page">
        <p>주문할 상품이 없습니다.</p>
        <button className="btn btn--primary" onClick={() => navigate('/')}>쇼핑하러 가기</button>
      </div>
    );
  }

  const onSubmit = async (data) => {
    setError('');
    try {
      const orderData = {
        deliveryAddr: data.deliveryAddr,
        paymentMethod: data.paymentMethod,
        items: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };
      const res = await createOrder(orderData);
      await clearCart();
      navigate(`/orders/${res.data.orderId}`, { replace: true });
    } catch (e) {
      setError(e.message || '주문에 실패했습니다.');
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">주문 / 결제</h1>
      <div className="checkout-layout">
        <form className="checkout-form form" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="section-title">배송 정보</h2>
          <div className="form-group">
            <label className="form-label">배송지 주소</label>
            <input
              className={`form-input ${errors.deliveryAddr ? 'form-input--error' : ''}`}
              {...register('deliveryAddr', { required: '배송지를 입력하세요.' })}
              placeholder="배송지 주소를 입력하세요"
            />
            {errors.deliveryAddr && <p className="form-error">{errors.deliveryAddr.message}</p>}
          </div>

          <h2 className="section-title">결제 수단</h2>
          <div className="payment-methods">
            {PAYMENT_METHODS.map((method) => (
              <label key={method} className="payment-option">
                <input type="radio" value={method} {...register('paymentMethod')} />
                {method}
              </label>
            ))}
          </div>

          {error && <p className="form-error form-error--block">{error}</p>}
          <button className="btn btn--primary btn--full btn--lg" type="submit">결제하기</button>
        </form>

        <div className="order-summary-box">
          <h2 className="section-title">주문 내역</h2>
          {cart.items.map((item) => (
            <div key={item.cartItemId} className="summary-item">
              <span>{item.productName} x{item.quantity}</span>
              <span>{item.itemTotalPrice?.toLocaleString()}원</span>
            </div>
          ))}
          <div className="summary-total">
            <strong>합계</strong>
            <strong>{cart.totalPrice?.toLocaleString()}원</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
