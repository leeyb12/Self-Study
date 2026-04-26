import { useState } from 'react';
import axios from 'axios';

export default function UploadForm({ onUploaded }) {
    const [form, setForm]         = useState({ title: '', artist: '', lyrics: '' });
    const [musicFile, setMusicFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState('');
    const [open, setOpen]         = useState(false);

    const handleSubmit = async () => {
        if (!musicFile)   { setError('mp3 파일을 선택해주세요.'); return; }
        if (!form.title)  { setError('제목을 입력해주세요.'); return; }
        setError('');
        setLoading(true);
        try {
            const data = new FormData();
            data.append('title',     form.title);
            data.append('artist',    form.artist);
            data.append('lyrics',    form.lyrics);
            data.append('musicFile', musicFile);
            if (imageFile) data.append('imageFile', imageFile);

            await axios.post('/api/songs', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setForm({ title: '', artist: '', lyrics: '' });
            setMusicFile(null);
            setImageFile(null);
            setOpen(false);
            onUploaded();
        } catch {
            setError('업로드 실패. 로그인 상태를 확인해주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ width: '340px', marginTop: '12px' }}>
            <button onClick={() => setOpen(v => !v)} style={toggleBtnStyle}>
                {open ? '닫기' : '+ 음악 업로드'}
            </button>
            {open && (
                <div style={formBoxStyle}>
                    {error && <p style={{ fontSize: '12px', color: '#c0392b', margin: 0 }}>{error}</p>}
                    <label style={labelStyle}>제목 *</label>
                    <input style={inputStyle} placeholder="곡 제목"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })} />
                    <label style={labelStyle}>아티스트</label>
                    <input style={inputStyle} placeholder="아티스트명"
                        value={form.artist}
                        onChange={e => setForm({ ...form, artist: e.target.value })} />
                    <label style={labelStyle}>MP3 파일 *</label>
                    <input type="file" accept=".mp3,audio/*" style={inputStyle}
                        onChange={e => setMusicFile(e.target.files[0])} />
                    <label style={labelStyle}>커버 이미지 (선택)</label>
                    <input type="file" accept="image/*" style={inputStyle}
                        onChange={e => setImageFile(e.target.files[0])} />
                    <label style={labelStyle}>가사 (선택) — 형식: 초:가사</label>
                    <textarea
                        style={{ ...inputStyle, height: '120px', resize: 'vertical', fontFamily: 'monospace', fontSize: '11px' }}
                        placeholder={"0:첫번째 가사\n5:두번째 가사\n12:세번째 가사"}
                        value={form.lyrics}
                        onChange={e => setForm({ ...form, lyrics: e.target.value })} />
                    <button onClick={handleSubmit} disabled={loading} style={submitBtnStyle}>
                        {loading ? '업로드 중...' : '업로드 후 바로 재생'}
                    </button>
                </div>
            )}
        </div>
    );
}

const toggleBtnStyle = { width: '100%', padding: '10px', background: 'transparent', border: '1px dashed #ccc', borderRadius: '2px', color: '#888', fontSize: '12px', cursor: 'pointer', letterSpacing: '0.06em' };
const formBoxStyle   = { background: '#fff', borderRadius: '4px', padding: '20px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '6px' };
const labelStyle     = { fontSize: '11px', color: '#999', letterSpacing: '0.06em', marginTop: '6px' };
const inputStyle     = { padding: '8px 10px', border: '1px solid #e0dbd2', borderRadius: '2px', fontSize: '12px', background: '#faf9f6', outline: 'none', width: '100%', boxSizing: 'border-box' };
const submitBtnStyle = { marginTop: '10px', padding: '11px', background: '#1a1a1a', color: '#f5f0e8', border: 'none', borderRadius: '2px', fontSize: '12px', cursor: 'pointer', letterSpacing: '0.06em' };