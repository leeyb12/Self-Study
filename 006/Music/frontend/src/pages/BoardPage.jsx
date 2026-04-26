import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';

export default function BoardPage() {
    const { isLoggedIn } = useAuth();
    const navigate       = useNavigate();

    const [posts,      setPosts]      = useState([]);
    const [selected,   setSelected]   = useState(null);
    const [writing,    setWriting]    = useState(false);
    const [form,       setForm]       = useState({ title: '', content: '' });
    const [error,      setError]      = useState('');
    const [loading,    setLoading]    = useState(true);
    const [fetchError, setFetchError] = useState('');

    const fetchPosts = async () => {
        try {
            setFetchError('');
            const res = await axios.get('/api/board');
            setPosts(res.data);
        } catch {
            setFetchError('게시글을 불러오지 못했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPosts(); }, []);

    const handleSubmit = async () => {
        if (!form.title.trim())   { setError('제목을 입력해주세요.'); return; }
        if (!form.content.trim()) { setError('내용을 입력해주세요.'); return; }
        try {
            await axios.post('/api/board', form);
            setForm({ title: '', content: '' });
            setWriting(false);
            setError('');
            fetchPosts();
        } catch {
            setError('작성 실패. 로그인 상태를 확인해주세요.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('삭제하시겠습니까?')) return;
        try {
            await axios.delete(`/api/board/${id}`);
            setSelected(null);
            fetchPosts();
        } catch {
            alert('삭제 권한이 없습니다.');
        }
    };

    const fmt = (dt) => new Date(dt).toLocaleDateString('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
    });

    return (
        <div style={pageStyle}>
            <div style={headerStyle}>
                <span style={{ fontSize: '14px', letterSpacing: '0.08em', color: '#1a1a1a' }}>게시판</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => navigate('/')} style={ghostBtnStyle}>플레이어</button>
                    {isLoggedIn && (
                        <button onClick={() => { setWriting(v => !v); setSelected(null); }} style={darkBtnStyle}>
                            {writing ? '취소' : '글쓰기'}
                        </button>
                    )}
                </div>
            </div>

            {writing && (
                <div style={cardStyle}>
                    {error && <p style={{ fontSize: '12px', color: '#c0392b', margin: 0 }}>{error}</p>}
                    <input style={inputStyle} placeholder="제목"
                        value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    <textarea style={{ ...inputStyle, height: '160px', resize: 'vertical' }}
                        placeholder="내용을 입력하세요"
                        value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
                    <button onClick={handleSubmit} style={darkBtnStyle}>등록</button>
                </div>
            )}

            {selected && !writing && (
                <div style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 500, color: '#1a1a1a' }}>{selected.title}</p>
                            <p style={{ margin: 0, fontSize: '11px', color: '#aaa' }}>{selected.author} · {fmt(selected.createdAt)}</p>
                        </div>
                        <button onClick={() => setSelected(null)} style={ghostBtnStyle}>닫기</button>
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid #f0ebe2', margin: '16px 0' }} />
                    <p style={{ fontSize: '14px', color: '#333', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                        {selected.content}
                    </p>
                    {isLoggedIn && (
                        <button onClick={() => handleDelete(selected.id)}
                            style={{ ...ghostBtnStyle, color: '#c0392b', marginTop: '12px' }}>
                            삭제
                        </button>
                    )}
                </div>
            )}

            <div style={listStyle}>
                {loading && <Spinner />}
                {fetchError && <p style={{ textAlign: 'center', color: '#c0392b', fontSize: '12px', padding: '24px 0' }}>{fetchError}</p>}
                {!loading && !fetchError && posts.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#bbb', fontSize: '12px', padding: '40px 0', letterSpacing: '0.06em' }}>
                        첫 번째 글을 작성해보세요.
                    </p>
                )}
                {!loading && posts.map(post => (
                    <div key={post.id}
                        style={{ ...listItemStyle, background: selected?.id === post.id ? '#1a1a1a' : '#fff', color: selected?.id === post.id ? '#f5f0e8' : '#1a1a1a' }}
                        onClick={() => { setSelected(post); setWriting(false); }}>
                        <div>
                            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 500 }}>{post.title}</p>
                            <p style={{ margin: 0, fontSize: '11px', color: selected?.id === post.id ? '#aaa' : '#999' }}>
                                {post.author} · {fmt(post.createdAt)}
                            </p>
                        </div>
                        <span style={{ fontSize: '18px', color: '#ccc' }}>›</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

const pageStyle     = { minHeight: '100vh', background: '#f5f0e8', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 16px 80px' };
const headerStyle   = { width: '100%', maxWidth: '480px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const cardStyle     = { width: '100%', maxWidth: '480px', background: '#fff', borderRadius: '4px', padding: '24px', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '10px' };
const listStyle     = { width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '2px' };
const listItemStyle = { padding: '14px 16px', borderRadius: '2px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.15s' };
const inputStyle    = { padding: '10px 12px', border: '1px solid #e0dbd2', borderRadius: '2px', fontSize: '13px', background: '#faf9f6', outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit' };
const darkBtnStyle  = { padding: '9px 16px', background: '#1a1a1a', color: '#f5f0e8', border: 'none', borderRadius: '2px', fontSize: '12px', cursor: 'pointer', letterSpacing: '0.06em' };
const ghostBtnStyle = { padding: '9px 16px', background: 'transparent', color: '#888', border: '1px solid #ddd', borderRadius: '2px', fontSize: '12px', cursor: 'pointer', letterSpacing: '0.06em' };