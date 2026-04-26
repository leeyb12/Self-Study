import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate  = useNavigate();
    const [form,  setForm]  = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        try {
            await login(form.username, form.password);
            navigate('/');
        } catch {
            setError('아이디 또는 비밀번호를 확인해주세요.');
        }
    };

    return (
        <div className="page-wrapper" style={{ justifyContent: 'center' }}>
            <div className="card" style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

                <h2 style={{ fontSize: '15px', fontWeight: 500, letterSpacing: '0.06em' }}>
                    로그인
                </h2>

                {error && <p className="error-text">{error}</p>}

                <input
                    className="input"
                    placeholder="아이디"
                    value={form.username}
                    onChange={e => setForm({ ...form, username: e.target.value })}
                />
                <input
                    className="input"
                    type="password"
                    placeholder="비밀번호"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
                <button className="btn btn-dark" onClick={handleSubmit}>
                    로그인
                </button>
                <button className="btn btn-ghost" onClick={() => navigate('/register')}>
                    회원가입
                </button>
            </div>
        </div>
    );
}