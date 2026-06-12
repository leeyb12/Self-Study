import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';
import HelpModal from './HelpModal';
import DesignSelector from './DesignSelector';

export default function Navbar() {
    const { isLoggedIn, username, logout } = useAuth();
    const { theme, setTheme, themes } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [showHelp, setShowHelp] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <nav className="navbar" style={{ display: 'flex', alignItems: 'center', padding: '0 20px', height: '60px', borderBottom: '1px solid var(--border-soft)' }}>
                {/* 1. 로고 */}
                <div className="navbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer', marginRight: '30px', fontWeight: 'bold' }}>
                    MUJI <span>PLAYER</span>
                </div>

                {/* 2. 메인 메뉴 */}
                <div className="navbar-links" style={{ display: 'flex', gap: '20px' }}>
                    <button className={`nav-btn ${location.pathname === '/' ? 'active' : ''}`} onClick={() => navigate('/')}>플레이어</button>
                    <button className={`nav-btn ${location.pathname === '/library' ? 'active' : ''}`} onClick={() => navigate('/library')}>보관함</button>
                    <button className={`nav-btn ${location.pathname === '/board' ? 'active' : ''}`} onClick={() => navigate('/board')}>게시판</button>
                </div>

                {/* 3. 유틸리티 (디자인 선택기 포함) */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginLeft: 'auto', marginRight: '20px' }}>
                    {/* 한 줄로 나열된 디자인 선택기 */}
                    <DesignSelector compact />
                    
                    <select className="theme-select" value={theme} onChange={e => setTheme(e.target.value)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                        {themes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                    </select>

                    <button className="nav-btn" onClick={() => setShowHelp(true)} style={{ padding: '0 5px' }}>?</button>
                </div>

                {/* 4. 회원 영역 */}
                <div className="user-area" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {isLoggedIn ? (
                        <>
                            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{username}님</span>
                            <button className="nav-btn" onClick={handleLogout} style={{ fontSize: '12px' }}>로그아웃</button>
                        </>
                    ) : (
                        <button className="nav-btn primary" onClick={() => navigate('/login')}>로그인</button>
                    )}
                </div>
            </nav>

            {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
        </>
    );
}