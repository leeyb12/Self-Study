import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeCartItem, clearCart } from '../api/cart';

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  const load = () => getCart().then((res) => setCart(res.data));
  useEffect(() => { load(); }, []);

  const handleUpdate = async (cartItemId, qty) => {
    if (qty < 1) return;
    const res = await updateCartItem(cartItemId, { quantity: qty });
    setCart(res.data);
  };

  const handleRemove = async (cartItemId) => {
    const res = await removeCartItem(cartItemId);
    setCart(res.data);
  };

  const handleClear = async () => {
    if (!confirm('장바구니를 비우시겠습니까?')) return;
    await clearCart();
    load();
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { cart } });
  };

  if (!cart) return <div className="loading page">불러오는 중...</div>;
  const items = cart.items || [];

  return (
    <div className="page">
      <div className="page-header">
        <h1>장바구니</h1>
        {items.length > 0 && (
          <button className="btn btn--sm btn--outline" onClick={handleClear}>전체 비우기</button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="empty-cart">
          <p>장바구니가 비어있습니다.</p>
          <button className="btn btn--primary" onClick={() => navigate('/')}>쇼핑 계속하기</button>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {items.map((item) => (
              <div key={item.cartItemId} className="cart-item">
                <div className="cart-item-icon">📦</div>
                <div className="cart-item-info">
                  <h3>{item.productName}</h3>
                  <p className="cart-item-price">{item.price?.toLocaleString()}원</p>
                </div>
                <div className="qty-control">
                  <button className="btn btn--sm btn--outline" onClick={() => handleUpdate(item.cartItemId, item.quantity - 1)}>-</button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="btn btn--sm btn--outline" onClick={() => handleUpdate(item.cartItemId, item.quantity + 1)}>+</button>
                </div>
                <span className="cart-item-total">{item.itemTotalPrice?.toLocaleString()}원</span>
                <button className="btn btn--sm btn--danger" onClick={() => handleRemove(item.cartItemId)}>제거</button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-total">
              합계: <strong>{cart.totalPrice?.toLocaleString()}원</strong>
            </div>
            <button className="btn btn--primary btn--lg" onClick={handleCheckout}>주문하기</button>
          </div>
        </>
      )}
    </div>
  );
}
