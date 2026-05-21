import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import HelpModal from './HelpModal';

export default function Navbar() {
    const { isLoggedIn, username, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showHelp, setShowHelp] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
      <>
        <nav className="navbar">
            <span
                className="navbar-logo"
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
            >
                MUJI <span>PLAYER</span>
            </span>

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

                <button
                    className="nav-btn"
                    onClick={() => setShowHelp(true)}
                    title="도움말"
                    style={{ fontWeight: 600 }}
                >
                    ?
                </button>

                {isLoggedIn ? (
                    <>
                        <span style={{ fontSize: '12px', color: '#bbb', padding: '0 4px' }}>
                            {username}님
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

        {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      </>
    );
}