import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">ShopAnalytics</Link>
        <nav className="nav">
          <Link to="/" className="nav-link">상품</Link>
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="nav-link">장바구니</Link>
              <Link to="/orders" className="nav-link">주문내역</Link>
              <Link to="/profile" className="nav-link">마이페이지</Link>
              {isAdmin && <Link to="/admin/analytics" className="nav-link nav-link--admin">분석</Link>}
              <button className="btn btn--sm btn--outline" onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">로그인</Link>
              <Link to="/signup" className="btn btn--sm btn--primary">회원가입</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
