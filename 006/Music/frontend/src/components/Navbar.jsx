import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { isLoggedIn, username, logout } = useAuth();
    const navigate  = useNavigate();
    const location  = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            {/* 로고 */}
            <span className="navbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                MUJI <span>PLAYER</span>
            </span>

            {/* 메뉴 */}
            <div className="navbar-links">
                <button
                    className={`nav-btn ${location.pathname === '/' ? 'active' : ''}`}
                    onClick={() => navigate('/')}
                >
                    플레이어
                </button>
                <button
                    className={`nav-btn ${location.pathname === '/board' ? 'active' : ''}`}
                    onClick={() => navigate('/board')}
                >
                    게시판
                </button>

               {isLoggedIn ? (
                    <>
                        <span style={{ fontSize: '12px', color: '#bbb', padding: '0 4px' }}>
                            {username}
                        </span>
                        <button className="nav-btn danger" onClick={handleLogout}>
                            로그아웃
                        </button>
                    </>
                ) : (
                    <>
                        <button className="nav-btn" onClick={() => navigate('/register')}>
                            회원가입
                        </button>
                        <button className="nav-btn primary" onClick={() => navigate('/login')}>
                            로그인
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}