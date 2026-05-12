import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

export default function BoardPage() {
    const { isLoggedIn, username } = useAuth();

    const [posts,       setPosts]       = useState([]);
    const [selected,    setSelected]    = useState(null);
    const [comments,    setComments]    = useState([]); // 사용: 댓글 목록
    const [writing,     setWriting]     = useState(false);
    const [editing,     setEditing]     = useState(false);
    const [form,        setForm]        = useState({ title: '', content: '' });
    const [files,       setFiles]       = useState([]);
    const [comment,     setComment]     = useState('');
    const [error,       setError]       = useState('');
    const [loading,     setLoading]     = useState(true);
    const [fetchError,  setFetchError]  = useState(''); // 사용: 에러 메시지 표시
    const fileInputRef = useRef(null);

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

    const fetchComments = async (boardId) => {
        try {
            const res = await axios.get(`/api/board/${boardId}/comments`);
            setComments(res.data);
        } catch {
            console.error("댓글 로딩 실패");
        }
    };

    useEffect(() => { fetchPosts(); }, []);

    const selectPost = async (post) => {
        setSelected(post);
        setWriting(false);
        setEditing(false);
        await fetchComments(post.id);
    };

    // 파일 다운로드 처리
    const handleDownload = (fileUrl, fileName) => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    // 게시글 작성
    const handleSubmit = async () => {
        if (!form.title.trim())   { setError('제목을 입력해주세요.'); return; }
        if (!form.content.trim()) { setError('내용을 입력해주세요.'); return; }
        try {
            const data = new FormData();
            data.append('title',   form.title);
            data.append('content', form.content);
            files.forEach(f => data.append('files', f));

            await axios.post('/api/board', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setForm({ title: '', content: '' });
            setFiles([]);
            setWriting(false);
            setError('');
            fetchPosts();
        } catch {
            setError('작성에 실패했습니다.');
        }
    };

    // 게시글 수정
    const handleUpdate = async () => {
        if (!form.title.trim())   { setError('제목을 입력해주세요.'); return; }
        if (!form.content.trim()) { setError('내용을 입력해주세요.'); return; }
        try {
            const data = new FormData();
            data.append('title',   form.title);
            data.append('content', form.content);
            files.forEach(f => data.append('files', f));

            const res = await axios.put(`/api/board/${selected.id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSelected(res.data);
            setFiles([]);
            setEditing(false);
            setError('');
            fetchPosts();
        } catch {
            setError('수정에 실패했습니다.');
        }
    };

    // 게시글 삭제
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

    // 첨부 파일 삭제
    const handleFileDelete = async (fileId) => {
        if (!window.confirm('파일을 삭제하시겠습니까?')) return;
        try {
            await axios.delete(`/api/board/files/${fileId}`);
            setSelected(prev => ({
                ...prev,
                files: prev.files.filter(f => f.id !== fileId),
            }));
        } catch {
            alert('파일 삭제 실패');
        }
    };

    // 댓글 작성 (함수 사용 연결)
    const handleCommentSubmit = async () => {
        if (!comment.trim()) return;
        try {
            await axios.post(`/api/board/${selected.id}/comments`, { content: comment });
            setComment('');
            fetchComments(selected.id);
        } catch {
            alert('댓글 작성 실패');
        }
    };

    // 댓글 삭제 (함수 사용 연결)
    const handleCommentDelete = async (commentId) => {
        if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
        try {
            await axios.delete(`/api/board/comments/${commentId}`);
            fetchComments(selected.id);
        } catch {
            alert('댓글 삭제 권한이 없습니다.');
        }
    };

    const fmt = (dt) => new Date(dt).toLocaleDateString('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
    });

    return (
        <div style={pageStyle}>
            <div style={headerStyle}>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>게시판</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {isLoggedIn && (
                        <button onClick={() => { setWriting(!writing); setSelected(null); setEditing(false); setForm({ title: '', content: '' }); setFiles([]); setError(''); }} style={darkBtnStyle}>
                            {writing ? '취소' : '글쓰기'}
                        </button>
                    )}
                </div>
            </div>

            {/* 에러 메시지 표시 (fetchError 사용) */}
            {fetchError && <p style={{ color: '#c0392b', fontSize: '12px', marginBottom: '10px' }}>{fetchError}</p>}

            {(writing || editing) && (
                <div style={cardStyle}>
                    {error && <p style={errorStyle}>{error}</p>}
                    <input style={inputStyle} placeholder="제목" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                    <textarea style={{ ...inputStyle, height: '160px', resize: 'vertical' }} placeholder="내용을 입력하세요" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <button onClick={() => fileInputRef.current?.click()} style={ghostBtnStyle}>파일 첨부</button>
                        <input ref={fileInputRef} type="file" accept="audio/*,image/*" multiple style={{ display: 'none' }} onChange={e => setFiles(Array.from(e.target.files))} />
                        {files.map((f, i) => (
                            <span key={i} style={{ fontSize: '11px', color: '#888' }}>{f.name} <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))} style={inlineRemoveBtn}>✕</button></span>
                        ))}
                    </div>
                    <button onClick={editing ? handleUpdate : handleSubmit} style={darkBtnStyle}>{editing ? '수정 완료' : '등록'}</button>
                </div>
            )}

            {selected && !writing && !editing && (
                <div style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 600 }}>{selected.title}</p>
                            <p style={{ margin: 0, fontSize: '11px', color: '#aaa' }}>{selected.author} · {fmt(selected.createdAt)}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {isLoggedIn && selected.author === username && (
                                <>
                                    <button onClick={() => { setEditing(true); setForm({ title: selected.title, content: selected.content }); }} style={ghostBtnStyle}>수정</button>
                                    <button onClick={() => handleDelete(selected.id)} style={{ ...ghostBtnStyle, color: '#c0392b' }}>삭제</button>
                                </>
                            )}
                            <button onClick={() => setSelected(null)} style={ghostBtnStyle}>닫기</button>
                        </div>
                    </div>
                    <hr style={dividerStyle} />
                    <p style={{ fontSize: '14px', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{selected.content}</p>

                    {/* 파일 리스트 및 다운로드 */}
                    {selected.files?.map(f => (
                        <div key={f.id} style={{ marginTop: '10px', padding: '10px', background: '#faf9f6', borderRadius: '4px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                <span style={{ fontSize: '12px' }}>{f.fileName}</span>
                                <button onClick={() => handleDownload(f.fileUrl, f.fileName)} style={{ ...ghostBtnStyle, padding: '2px 8px', fontSize: '11px' }}>📥 다운로드</button>
                            </div>
                            {f.fileType?.includes('image') ? <img src={f.fileUrl} style={{ maxWidth: '100%' }} alt="첨부" /> : <audio controls src={f.fileUrl} style={{ width: '100%' }} />}
                            {isLoggedIn && selected.author === username && <button onClick={() => handleFileDelete(f.id)} style={inlineRemoveBtn}>파일 삭제</button>}
                        </div>
                    ))}

                    <hr style={dividerStyle} />
                    {/* 댓글 UI (comments, handleCommentDelete 사용) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <p style={{ fontSize: '12px', color: '#888' }}>댓글 {comments.length}</p>
                        {comments.map(c => (
                            <div key={c.id} style={commentStyle}>
                                <div style={{ flex: 1 }}>
                                    <span style={{ fontWeight: 600, fontSize: '12px' }}>{c.author}</span>
                                    <p style={{ margin: '4px 0', fontSize: '13px' }}>{c.content}</p>
                                </div>
                                {isLoggedIn && c.author === username && (
                                    <button onClick={() => handleCommentDelete(c.id)} style={inlineRemoveBtn}>✕</button>
                                )}
                            </div>
                        ))}
                        {/* 댓글 입력 (handleCommentSubmit 사용) */}
                        {isLoggedIn && (
                            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                                <input style={{ ...inputStyle, flex: 1 }} value={comment} onChange={e => setComment(e.target.value)} placeholder="댓글을 입력하세요" />
                                <button onClick={handleCommentSubmit} style={darkBtnStyle}>등록</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div style={listStyle}>
                {loading ? <Spinner /> : posts.map(post => (
                    <div key={post.id} style={{ ...listItemStyle, background: selected?.id === post.id ? '#1a1a1a' : '#fff', color: selected?.id === post.id ? '#fff' : '#1a1a1a' }} onClick={() => selectPost(post)}>
                        <div>
                            <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 500 }}>{post.title} {post.files?.length > 0 && '📎'}</p>
                            <p style={{ margin: 0, fontSize: '11px', color: '#999' }}>{post.author} · {fmt(post.createdAt)}</p>
                        </div>
                        <span>›</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* 스타일 정의 (동일) */
const pageStyle = { minHeight: '100vh', background: '#f5f0e8', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 16px' };
const headerStyle = { width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' };
const cardStyle = { width: '100%', maxWidth: '600px', background: '#fff', padding: '24px', borderRadius: '4px', border: '1px solid #ede8df', marginBottom: '12px' };
const listStyle = { width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '2px' };
const listItemStyle = { padding: '14px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' };
const commentStyle = { padding: '8px', background: '#faf9f6', borderRadius: '2px', display: 'flex' };
const inputStyle = { padding: '10px', border: '1px solid #ddd', borderRadius: '2px', width: '100%', boxSizing: 'border-box' };
const darkBtnStyle = { padding: '10px 16px', background: '#1a1a1a', color: '#fff', border: 'none', cursor: 'pointer' };
const ghostBtnStyle = { padding: '8px 12px', background: 'transparent', border: '1px solid #ddd', color: '#888', cursor: 'pointer' };
const errorStyle = { color: '#c0392b', fontSize: '12px' };
const dividerStyle = { border: 'none', borderTop: '1px solid #eee', margin: '15px 0' };
const inlineRemoveBtn = { background: 'transparent', border: 'none', color: '#c0392b', cursor: 'pointer', fontSize: '12px' };