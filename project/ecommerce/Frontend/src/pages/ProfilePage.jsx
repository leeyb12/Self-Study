import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getMyInfo, updateProfile, withdraw } from '../api/auth';
import { getMyReviews } from '../api/reviews';
import { getMyBehaviorSummary } from '../api/analytics';
import useAuthStore from '../store/authStore';
import StarRating from '../components/StarRating';
import Pagination from '../components/Pagination';

export default function ProfilePage() {
  const { logout, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState({ page: 0, totalPages: 1 });
  const [summary, setSummary] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    getMyInfo().then((res) => {
      setMember(res.data);
      reset({ name: res.data.name, phone: res.data.phone, address: res.data.address });
      setUser({ name: res.data.name, role: res.data.role ?? 'USER' });
    });
    loadReviews(0);
    getMyBehaviorSummary().then((res) => setSummary(res.data));
  }, []);

  const loadReviews = (page) => {
    getMyReviews({ page, size: 5 }).then((res) => {
      setReviews(res.data?.content || []);
      setReviewPage({ page: res.data?.page ?? 0, totalPages: res.data?.totalPages ?? 1 });
    });
  };

  const onSave = async (data) => {
    try {
      const res = await updateProfile(data);
      setMember(res.data);
      setUser({ name: res.data.name });
      setEditing(false);
      setSaveMsg('저장되었습니다.');
      setTimeout(() => setSaveMsg(''), 2000);
    } catch (e) {
      setSaveMsg(e.message || '저장에 실패했습니다.');
    }
  };

  const handleWithdraw = async () => {
    if (!confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    await withdraw();
    logout();
    navigate('/');
  };

  if (!member) return <div className="loading page">불러오는 중...</div>;

  return (
    <div className="page">
      <h1 className="page-title">마이페이지</h1>

      {summary && (
        <div className="behavior-summary">
          <h2 className="section-title">나의 구매 행동 요약</h2>
          <div className="summary-stats">
            <div className="stat-card">
              <div className="stat-value">{summary.viewCount}</div>
              <div className="stat-label">상품 조회</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{summary.cartAddCount}</div>
              <div className="stat-label">장바구니 담기</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{summary.purchaseCount}</div>
              <div className="stat-label">구매 완료</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{summary.reviewCount}</div>
              <div className="stat-label">리뷰 작성</div>
            </div>
          </div>
        </div>
      )}

      <div className="profile-grid">
        <div className="profile-card">
          <div className="profile-card-header">
            <h2 className="section-title">회원 정보</h2>
            {!editing && (
              <button className="btn btn--sm btn--outline" onClick={() => setEditing(true)}>수정</button>
            )}
          </div>
          {editing ? (
            <form className="form" onSubmit={handleSubmit(onSave)}>
              <div className="form-group">
                <label className="form-label">이름</label>
                <input className="form-input" {...register('name', { required: true })} />
              </div>
              <div className="form-group">
                <label className="form-label">전화번호</label>
                <input className="form-input" {...register('phone')} />
              </div>
              <div className="form-group">
                <label className="form-label">주소</label>
                <input className="form-input" {...register('address')} />
              </div>
              <div className="form-row">
                <button className="btn btn--primary" type="submit">저장</button>
                <button className="btn btn--outline" type="button" onClick={() => setEditing(false)}>취소</button>
              </div>
            </form>
          ) : (
            <dl className="profile-dl">
              <dt>이메일</dt><dd>{member.email}</dd>
              <dt>이름</dt><dd>{member.name}</dd>
              <dt>전화번호</dt><dd>{member.phone || '-'}</dd>
              <dt>주소</dt><dd>{member.address || '-'}</dd>
              <dt>가입일</dt><dd>{new Date(member.createdAt).toLocaleDateString()}</dd>
            </dl>
          )}
          {saveMsg && <p className="form-error">{saveMsg}</p>}
          <button className="btn btn--sm btn--danger withdraw-btn" onClick={handleWithdraw}>회원 탈퇴</button>
        </div>

        <div className="profile-reviews">
          <h2 className="section-title">내 리뷰</h2>
          {reviews.length === 0 ? (
            <p className="empty">작성한 리뷰가 없습니다.</p>
          ) : (
            reviews.map((r) => (
              <div key={r.reviewId} className="review-card">
                <div className="review-card-header">
                  <span className="review-product">{r.productName}</span>
                  <StarRating value={r.rating} readonly />
                  <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="review-content">{r.content}</p>
              </div>
            ))
          )}
          <Pagination page={reviewPage.page} totalPages={reviewPage.totalPages} onPageChange={loadReviews} />
        </div>
      </div>
    </div>
  );
}
