import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../api/products';
import { addToCart } from '../api/cart';
import { getProductReviews, createReview, deleteReview } from '../api/reviews';
import useAuthStore from '../store/authStore';
import StarRating from '../components/StarRating';
import Pagination from '../components/Pagination';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState({ page: 0, totalPages: 1 });
  const [qty, setQty] = useState(1);
  const [cartMsg, setCartMsg] = useState('');

  const [newRating, setNewRating] = useState(5);
  const [newContent, setNewContent] = useState('');
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    getProduct(id).then((res) => setProduct(res.data));
    loadReviews(0);
  }, [id]);

  const loadReviews = (page) => {
    getProductReviews(id, { page, size: 5 }).then((res) => {
      setReviews(res.data?.content || []);
      setReviewPage({ page: res.data?.page ?? 0, totalPages: res.data?.totalPages ?? 1 });
    });
  };

  const handleAddCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      await addToCart({ productId: Number(id), quantity: qty });
      setCartMsg('장바구니에 담았습니다!');
      setTimeout(() => setCartMsg(''), 2000);
    } catch (e) {
      setCartMsg(e.message || '오류가 발생했습니다.');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    try {
      await createReview({ productId: Number(id), rating: newRating, content: newContent });
      setNewContent('');
      setNewRating(5);
      loadReviews(0);
    } catch (e) {
      setReviewError(e.message || '리뷰 작성에 실패했습니다.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('리뷰를 삭제하시겠습니까?')) return;
    await deleteReview(reviewId);
    loadReviews(reviewPage.page);
  };

  if (!product) return <div className="loading page">불러오는 중...</div>;

  return (
    <div className="page">
      <div className="product-detail">
        <div className="product-detail-img">📦</div>
        <div className="product-detail-info">
          <p className="product-card-category">{product.categoryName}</p>
          <h1 className="product-detail-name">{product.name}</h1>
          <p className="product-detail-price">{product.price?.toLocaleString()}원</p>
          {product.averageRating && (
            <div className="product-detail-rating">
              <StarRating value={Math.round(product.averageRating)} readonly />
              <span>{product.averageRating.toFixed(1)} / 5.0</span>
            </div>
          )}
          <p className="product-detail-stock">재고: {product.stockQty}개</p>
          <p className="product-detail-desc">{product.description}</p>

          <div className="product-detail-actions">
            <div className="qty-control">
              <button className="btn btn--sm btn--outline" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
              <span className="qty-value">{qty}</span>
              <button className="btn btn--sm btn--outline" onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <button
              className="btn btn--primary btn--lg"
              onClick={handleAddCart}
              disabled={product.status !== 'ON_SALE'}
            >
              {product.status === 'ON_SALE' ? '장바구니 담기' : '품절'}
            </button>
          </div>
          {cartMsg && <p className="cart-msg">{cartMsg}</p>}
        </div>
      </div>

      <section className="reviews-section">
        <h2 className="section-title">리뷰 ({reviewPage.page * 5 + reviews.length})</h2>

        {isAuthenticated && (
          <form className="review-form" onSubmit={handleSubmitReview}>
            <h3>리뷰 작성</h3>
            <StarRating value={newRating} onChange={setNewRating} />
            <textarea
              className="form-input review-textarea"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="구매 후 리뷰를 작성하세요."
              rows={3}
            />
            {reviewError && <p className="form-error">{reviewError}</p>}
            <button className="btn btn--primary" type="submit">등록</button>
          </form>
        )}

        <div className="review-list">
          {reviews.length === 0 ? (
            <p className="empty">아직 리뷰가 없습니다.</p>
          ) : (
            reviews.map((r) => (
              <div key={r.reviewId} className="review-card">
                <div className="review-card-header">
                  <span className="review-author">{r.memberName}</span>
                  <StarRating value={r.rating} readonly />
                  <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="review-content">{r.content}</p>
                {isAuthenticated && (
                  <button className="btn btn--sm btn--danger" onClick={() => handleDeleteReview(r.reviewId)}>삭제</button>
                )}
              </div>
            ))
          )}
        </div>
        <Pagination page={reviewPage.page} totalPages={reviewPage.totalPages} onPageChange={loadReviews} />
      </section>
    </div>
  );
}
