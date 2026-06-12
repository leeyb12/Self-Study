import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const { login, isLoggedIn } = useAuth();
    const navigate  = useNavigate();
    const [form,    setForm]    = useState({ username: '', password: '' });
    const [error,   setError]   = useState('');
    const [loading, setLoading] = useState(false);

    if (isLoggedIn) {
        navigate('/');
        return null;
    }

    const handleSubmit = async () => {
        if (!form.username.trim()) { setError('아이디를 입력해주세요.'); return; }
        if (!form.password)        { setError('비밀번호를 입력해주세요.'); return; }
        setLoading(true);
        setError('');
        try {
            await login(form.username, form.password);
            navigate('/');
        } catch {
            setError('아이디 또는 비밀번호를 확인해주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper" style={{ justifyContent: 'center' }}>
            <div className="card" style={{
                width: '320px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
            }}>
                <h2 style={{ fontSize: '15px', fontWeight: 500, letterSpacing: '0.06em', margin: 0 }}>
                    로그인
                </h2>

                {error && (
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--danger)' }}>{error}</p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={labelStyle}>아이디</label>
                    <input
                        className="input"
                        placeholder="아이디 입력"
                        value={form.username}
                        onChange={e => setForm({ ...form, username: e.target.value })}
                        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={labelStyle}>비밀번호</label>
                    <input
                        className="input"
                        type="password"
                        placeholder="비밀번호 입력"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    />
                </div>

                <button
                    className="btn btn-dark"
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{ marginTop: '4px' }}
                >
                    {loading ? '로그인 중...' : '로그인'}
                </button>

                <button
                    className="btn btn-ghost"
                    onClick={() => navigate('/register')}
                >
                    회원가입
                </button>
            </div>
        </div>
    );
}

const labelStyle = { fontSize: '11px', color: 'var(--muted-strong)', letterSpacing: '0.06em' };