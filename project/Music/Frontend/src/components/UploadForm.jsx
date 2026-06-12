import { useState, useRef } from 'react';
import axios from 'axios';

export default function UploadForm({ onUploaded }) {
    const [form, setForm]                 = useState({ title: '', artist: '', lyrics: '' });
    const [musicFile, setMusicFile]       = useState(null);
    const [imageFile, setImageFile]       = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading]           = useState(false);
    const [error, setError]               = useState('');
    const [open, setOpen]                 = useState(false);
    const imageInputRef                    = useRef(null);

    // 메타데이터 읽기 로직 (기존과 동일)
    const readMetadata = (file) => {
        return new Promise((resolve) => {
            try {
                window.jsmediatags.read(file, {
                    onSuccess: (tag) => {
                        const title   = tag.tags.title  ?? '';
                        const artist  = tag.tags.artist ?? '';
                        const lyrics  = tag.tags.lyrics?.lyrics ?? ''; 
                        const picture = tag.tags.picture;

                        let imageBlob = null;
                        if (picture) {
                            const byteArray = new Uint8Array(picture.data);
                            imageBlob = new Blob([byteArray], { type: picture.format });
                        }
                        resolve({ title, artist, lyrics, imageBlob });
                    },
                    onError: () => resolve({ title: '', artist: '', lyrics: '', imageBlob: null }),
                });
            } catch {
                resolve({ title: '', artist: '', lyrics: '', imageBlob: null });
            }
        });
    };

    const handleMusicFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setMusicFile(file);

        const defaultTitle = file.name.replace(/\.[^.]+$/, '').replace(/^\d+\.\s*/, '');
        if (!window.jsmediatags) {
            setForm(prev => ({ ...prev, title: defaultTitle }));
            return;
        }

        const { title, artist, lyrics, imageBlob } = await readMetadata(file);
        setForm(prev => ({
            ...prev,
            title:  title  || defaultTitle,
            artist: artist || prev.artist,
            lyrics: lyrics || '', 
        }));

        if (imageBlob) {
            const url     = URL.createObjectURL(imageBlob);
            const imgFile = new File([imageBlob], 'cover.jpg', { type: imageBlob.type });
            setImagePreview(url);
            setImageFile(imgFile);
        }
    };

    const handleImageFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        if (!musicFile)         { setError('mp3 파일을 선택해주세요.'); return; }
        if (!form.title.trim()) { setError('제목을 입력해주세요.'); return; }
        setError('');
        setLoading(true);

        try {
            const data = new FormData();
            data.append('title',     form.title.trim());
            data.append('artist',    form.artist.trim());
            data.append('lyrics',    form.lyrics.trim());
            data.append('musicFile', musicFile);
            if (imageFile) data.append('imageFile', imageFile);

            await axios.post('/api/songs', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setForm({ title: '', artist: '', lyrics: '' });
            setMusicFile(null);
            setImageFile(null);
            setImagePreview(null);
            setOpen(false);
            onUploaded();
        } catch (err) {
            const msg = err.response?.data?.error ?? '업로드 실패. 로그인 상태를 확인해주세요.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ width: '100%', marginTop: '12px' }}>
            {/* 트리거 버튼 */}
            <button onClick={() => setOpen(true)} style={toggleBtnStyle}>
                + 음악 업로드
            </button>

            {/* 모달 레이어 */}
            {open && (
                <div style={modalOverlayStyle} onClick={() => !loading && setOpen(false)}>
                    {/* 모달 콘텐츠 박스 (클릭 이벤트 전파 방지) */}
                    <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text)' }}>음악 업로드</h3>
                            <button onClick={() => setOpen(false)} style={closeXBtnStyle}>&times;</button>
                        </div>

                        {error && (
                            <p style={{ fontSize: '12px', color: 'var(--danger)', marginBottom: '12px' }}>{error}</p>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {/* MP3 선택 */}
                            <div>
                                <label style={labelStyle}>MP3 파일 *</label>
                                <input type="file" accept=".mp3,audio/*" style={inputStyle} onChange={handleMusicFile} />
                            </div>

                            {/* 커버 이미지 */}
                            <div>
                                <label style={labelStyle}>커버 이미지</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                                    <div style={coverPreviewBoxStyle} onClick={() => imageInputRef.current?.click()}>
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span style={{ color: 'var(--action-text)', fontSize: '20px' }}>+</span>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        <button onClick={() => imageInputRef.current?.click()} style={smallBtnStyle}>변경</button>
                                        {imagePreview && <button onClick={() => { setImageFile(null); setImagePreview(null); }} style={{ ...smallBtnStyle, color: 'var(--danger)' }}>제거</button>}
                                    </div>
                                    <input ref={imageInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageFile} />
                                </div>
                            </div>

                            {/* 제목 & 아티스트 */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>제목 *</label>
                                    <input style={inputStyle} placeholder="곡 제목" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>아티스트</label>
                                    <input style={inputStyle} placeholder="아티스트명" value={form.artist} onChange={e => setForm({ ...form, artist: e.target.value })} />
                                </div>
                            </div>

                            {/* 가사 입력 */}
                            <div>
                                <label style={labelStyle}>가사</label>
                                <textarea
                                    style={{ ...inputStyle, height: '120px', resize: 'none' }}
                                    placeholder="가사를 입력하거나 MP3 파일에서 자동으로 읽어옵니다."
                                    value={form.lyrics}
                                    onChange={e => setForm({ ...form, lyrics: e.target.value })}
                                />
                            </div>

                            <button onClick={handleSubmit} disabled={loading} style={submitBtnStyle}>
                                {loading ? '업로드 중...' : '업로드 시작'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* --- 스타일 정의 --- */
const toggleBtnStyle = { width: '100%', padding: '10px', background: 'transparent', border: '1px dashed var(--border-soft)', borderRadius: '2px', color: 'var(--muted)', fontSize: '12px', cursor: 'pointer', letterSpacing: '0.06em' };

const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 2000, backdropFilter: 'blur(2px)'
};

const modalContentStyle = {
    background: 'var(--surface)', width: '400px', padding: '24px', borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)', border: '1px solid var(--border)'
};

const closeXBtnStyle = { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--muted-strong)', lineHeight: '1' };
const labelStyle = { fontSize: '11px', color: 'var(--muted-strong)', fontWeight: 'bold', display: 'block', marginBottom: '4px' };
const inputStyle = { padding: '10px', border: '1px solid var(--border-soft)', borderRadius: '4px', fontSize: '13px', background: 'var(--surface-alt)', outline: 'none', width: '100%', boxSizing: 'border-box' };
const submitBtnStyle = { marginTop: '10px', padding: '12px', background: 'var(--action-bg)', color: 'var(--action-text)', border: 'none', borderRadius: '4px', fontSize: '13px', cursor: 'pointer', width: '100%', fontWeight: 'bold' };
const smallBtnStyle = { padding: '4px 8px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '11px', color: 'var(--muted)', cursor: 'pointer' };
const coverPreviewBoxStyle = { width: '48px', height: '48px', borderRadius: '4px', background: 'var(--action-bg)', overflow: 'hidden', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' };