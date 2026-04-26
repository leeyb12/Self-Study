import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [form,    setForm]    = useState({ username: '', password: '', confirm: '' });
    const [error,   setError]   = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        // form 기본 동작 방지
        if (e) e.preventDefault();

        setError('');
        setSuccess('');

        if (!form.username.trim())        { setError('아이디를 입력해주세요.'); return; }
        if (form.username.length < 3)     { setError('아이디는 3자 이상이어야 합니다.'); return; }
        if (!form.password)               { setError('비밀번호를 입력해주세요.'); return; }
        if (form.password.length < 4)     { setError('비밀번호는 4자 이상이어야 합니다.'); return; }
        if (form.password !== form.confirm) { setError('비밀번호가 일치하지 않습니다.'); return; }

        setLoading(true);
        try {
            const response = await axios({
                method: 'post',
                url: '/api/auth/register',
                data: JSON.stringify({           // ← JSON.stringify 명시
                    username: form.username,
                    password: form.password,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('성공:', response.data);
            setSuccess('회원가입이 완료되었습니다.');
            setTimeout(() => navigate('/login'), 1200);

        } catch (e) {
            console.log('status:', e.response?.status);
            console.log('data:', e.response?.data);
            const msg = e.response?.data?.error ?? '회원가입에 실패했습니다.';
            setError(msg);
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
                <h2 style={{ fontSize: '15px', fontWeight: 500, letterSpacing: '0.06em' }}>
                    회원가입
                </h2>

                {error   && <p className="error-text">{error}</p>}
                {success && <p style={{ fontSize: '12px', color: '#27ae60' }}>{success}</p>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={labelStyle}>아이디 *</label>
                    <input
                        className="input"
                        placeholder="3자 이상 입력"
                        value={form.username}
                        onChange={e => setForm({ ...form, username: e.target.value })}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={labelStyle}>비밀번호 *</label>
                    <input
                        className="input"
                        type="password"
                        placeholder="4자 이상 입력"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={labelStyle}>비밀번호 확인 *</label>
                    <input
                        className="input"
                        type="password"
                        placeholder="비밀번호를 다시 입력"
                        value={form.confirm}
                        onChange={e => setForm({ ...form, confirm: e.target.value })}
                        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    />
                </div>

                {form.confirm && (
                    <p style={{
                        fontSize: '11px',
                        color: form.password === form.confirm ? '#27ae60' : '#c0392b',
                        marginTop: '-6px',
                    }}>
                        {form.password === form.confirm
                            ? '✓ 비밀번호가 일치합니다'
                            : '✗ 비밀번호가 일치하지 않습니다'}
                    </p>
                )}

                <button
                    className="btn btn-dark"
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{ marginTop: '4px' }}
                >
                    {loading ? '처리 중...' : '회원가입'}
                </button>

                <button
                    className="btn btn-ghost"
                    onClick={() => navigate('/login')}
                >
                    로그인으로 돌아가기
                </button>
            </div>
        </div>
    );
}

const labelStyle = {
    fontSize: '11px',
    color: '#999',
    letterSpacing: '0.06em',
};