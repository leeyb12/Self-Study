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
    const [page,        setPage]        = useState(0);
    const [totalPages,  setTotalPages]  = useState(1);
    const [hasNext,     setHasNext]     = useState(false);
    const [hasPrev,     setHasPrev]     = useState(false);
    const fileInputRef = useRef(null);

    const fetchPosts = async (pageNumber = 0) => {
        try {
            setFetchError('');
            setLoading(true);
            const res = await axios.get('/api/board', {
                params: { page: pageNumber }
            });
            setPosts(res.data.content || []);
            setPage(res.data.page);
            setTotalPages(res.data.totalPages);
            setHasNext(res.data.hasNext);
            setHasPrev(res.data.hasPrev);
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

    useEffect(() => { fetchPosts(page); }, [page]);

    const selectPost = async (post) => {
        setSelected(post);
        setWriting(false);
        setEditing(false);
        await fetchComments(post.id);
    };

    // 파일 다운로드 처리
    const handleDownload = (fileUrl, fileName, fileType) => {
        if (fileType?.includes('audio') && !isLoggedIn) {
            alert('로그인 후 음악 파일을 다운로드할 수 있습니다.');
            return;
        }

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
            fetchPosts(page);
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
            fetchPosts(page);
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
            fetchPosts(page);
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

    const closeModal = () => {
        setWriting(false);
        setEditing(false);
        setSelected(null);
        setError('');
        setFiles([]);
    };

    const openWriteModal = () => {
        setWriting(true);
        setEditing(false);
        setSelected(null);
        setForm({ title: '', content: '' });
        setFiles([]);
        setError('');
    };

    return (
        <div style={pageStyle}>
            <div style={headerStyle}>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>게시판</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {isLoggedIn && (
                        <button onClick={openWriteModal} style={darkBtnStyle}>
                            {writing || editing ? '취소' : '글쓰기'}
                        </button>
                    )}
                </div>
            </div>

            {/* 에러 메시지 표시 (fetchError 사용) */}
            {fetchError && <p style={{ color: 'var(--danger)', fontSize: '12px', marginBottom: '10px' }}>{fetchError}</p>}

            {(writing || editing || selected) && (
                <div style={modalOverlayStyle} onClick={closeModal}>
                    <div style={modalStyle} onClick={e => e.stopPropagation()}>
                        <div style={modalHeaderStyle}>
                            <div>
                                <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>
                                    {writing || editing ? (editing ? '게시글 수정' : '게시글 작성') : '게시글 보기'}
                                </p>
                                <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--muted)' }}>
                                    {writing || editing ? '글을 작성하거나 수정하실 수 있습니다.' : '게시글 내용을 확인하세요.'}
                                </p>
                            </div>
                            <button onClick={closeModal} style={closeModalBtnStyle}>✕</button>
                        </div>

                        <hr style={dividerStyle} />

                        {(writing || editing) ? (
                            <>
                                {error && <p style={errorStyle}>{error}</p>}
                                <input style={inputStyle} placeholder="제목" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                                <textarea style={{ ...inputStyle, height: '160px', resize: 'vertical' }} placeholder="내용을 입력하세요" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                    <button onClick={() => fileInputRef.current?.click()} style={ghostBtnStyle}>파일 첨부</button>
                                    <input ref={fileInputRef} type="file" accept="audio/*,image/*" multiple style={{ display: 'none' }} onChange={e => setFiles(Array.from(e.target.files))} />
                                    {files.map((f, i) => (
                                        <span key={i} style={{ fontSize: '11px', color: 'var(--muted)' }}>{f.name} <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))} style={inlineRemoveBtn}>✕</button></span>
                                    ))}
                                </div>
                                <button onClick={editing ? handleUpdate : handleSubmit} style={darkBtnStyle}>{editing ? '수정 완료' : '등록'}</button>
                            </>
                        ) : (
                            selected && (
                                <>
                                    <div style={{ marginBottom: '16px' }}>
                                        <p style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 600 }}>{selected.title}</p>
                                        <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted-strong)' }}>{selected.author} · {fmt(selected.createdAt)}</p>
                                    </div>
                                    <p style={{ fontSize: '14px', lineHeight: '1.8', whiteSpace: 'pre-wrap', marginBottom: '18px' }}>{selected.content}</p>

                                    {selected.files?.map(f => {
                                        const isImage = f.fileType?.includes('image');

                                        return (
                                            <div key={f.id} style={{ marginBottom: '12px', padding: '12px', background: 'var(--surface-alt)', borderRadius: '4px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                    {!isImage && (
                                                        <button
                                                            onClick={() => handleDownload(f.fileUrl, f.fileName, f.fileType)}
                                                            style={{ ...ghostBtnStyle, padding: '4px 10px', fontSize: '12px' }}
                                                        >
                                                            📥 다운로드
                                                        </button>
                                                    )}
                                                </div>

                                                {isImage ? (
                                                    <img src={f.fileUrl} style={{ maxWidth: '100%' }} alt="첨부" />
                                                ) : (
                                                    <audio controls src={f.fileUrl} style={{ width: '100%' }} />
                                                )}

                                                {isLoggedIn && selected.author === username && (
                                                    <button onClick={() => handleFileDelete(f.id)} style={inlineRemoveBtn}>
                                                        파일 삭제
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {isLoggedIn && selected.author === username && (
                                        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                                            <button onClick={() => { setEditing(true); setWriting(false); setForm({ title: selected.title, content: selected.content }); }} style={ghostBtnStyle}>수정</button>
                                            <button onClick={() => handleDelete(selected.id)} style={{ ...ghostBtnStyle, color: 'var(--danger)' }}>삭제</button>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>댓글 {comments.length}</p>
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
                                        {isLoggedIn && (
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                                                <input style={{ ...inputStyle, flex: 1 }} value={comment} onChange={e => setComment(e.target.value)} placeholder="댓글을 입력하세요" />
                                                <button onClick={handleCommentSubmit} style={darkBtnStyle}>등록</button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )
                        )}
                    </div>
                </div>
            )}

            <div style={listStyle}>
                {loading ? <Spinner /> : posts.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)' }}>게시물이 없습니다.</div>
                ) : posts.map(post => (
                    <div key={post.id} style={{ ...listItemStyle, background: selected?.id === post.id ? 'var(--action-bg)' : 'var(--surface)', color: selected?.id === post.id ? 'var(--action-text)' : 'var(--text)' }} onClick={() => selectPost(post)}>
                        <div>
                            <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 500 }}>{post.title} {post.files?.length > 0 && '📎'}</p>
                            <p style={{ margin: 0, fontSize: '11px', color: 'var(--muted-strong)' }}>{post.author} · {fmt(post.createdAt)}</p>
                        </div>
                        <span>›</span>
                    </div>
                ))}
            </div>

            <div style={paginationStyle}>
                <button onClick={() => setPage(prev => Math.max(prev - 1, 0))} disabled={!hasPrev} style={paginationBtnStyle}>이전</button>
                <span style={{ fontSize: '14px', color: 'var(--muted-strong)' }}>{page + 1} / {Math.max(totalPages, 1)}</span>
                <button onClick={() => setPage(prev => Math.min(prev + 1, Math.max(totalPages - 1, 0)))} disabled={!hasNext} style={paginationBtnStyle}>다음</button>
            </div>
        </div>
    );
}

const paginationStyle = { width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center', marginTop: '16px' };
const paginationBtnStyle = { padding: '8px 14px', border: '1px solid var(--border-soft)', background: 'var(--surface)', color: 'var(--text)', cursor: 'pointer', borderRadius: '4px' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400 };
const modalStyle = { width: 'min(680px, calc(100% - 40px))', background: 'var(--surface)', borderRadius: '6px', border: '1px solid var(--border)', padding: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', maxHeight: '90vh', overflowY: 'auto' };
const modalHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '12px' };
const closeModalBtnStyle = { background: 'transparent', border: 'none', fontSize: '20px', color: 'var(--muted)', cursor: 'pointer' };

/* 스타일 정의 (동일) */
const pageStyle = { minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 16px' };
const headerStyle = { width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' };
const listStyle = { width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '2px' };
const listItemStyle = { padding: '14px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-soft)', background: 'var(--surface)' };
const commentStyle = { padding: '8px', background: 'var(--surface-alt)', borderRadius: '2px', display: 'flex' };
const inputStyle = { padding: '10px', border: '1px solid var(--border-soft)', borderRadius: '2px', width: '100%', boxSizing: 'border-box', background: 'var(--surface-alt)', color: 'var(--text)' };
const darkBtnStyle = { padding: '10px 16px', background: 'var(--action-bg)', color: 'var(--action-text)', border: 'none', cursor: 'pointer' };
const ghostBtnStyle = { padding: '8px 12px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', cursor: 'pointer' };
const errorStyle = { color: 'var(--danger)', fontSize: '12px' };
const dividerStyle = { border: 'none', borderTop: '1px solid var(--border)', margin: '15px 0' };
const inlineRemoveBtn = { background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '12px' };