import { useState } from 'react';
import axios from 'axios';

export default function SongInfoModal({ song, onClose, onSaved }) {
    const [form, setForm] = useState({
        title:  song.title,
        artist: song.artist,
    });
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState('');

    const handleSave = async (e) => {
        e.stopPropagation();
        if (!form.title.trim())  { setError('제목을 입력해주세요.'); return; }
        if (!form.artist.trim()) { setError('아티스트를 입력해주세요.'); return; }
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams();
            params.append('title',  form.title);
            params.append('artist', form.artist);
            params.append('lyrics', song.lyrics ?? '');

            await axios.put(`/api/songs/${song.id}`, params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

            onSaved({ ...song, title: form.title, artist: form.artist });
            onClose();
        } catch (err) {
            setError(err.response?.data?.error ?? '수정에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={e => e.stopPropagation()}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: 500, color: '#1a1a1a' }}>
                        음악 정보 수정
                    </p>
                    <button onClick={(e) => { e.stopPropagation(); onClose(); }} style={closeBtnStyle}>✕</button>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #f0ebe2', margin: '0 0 20px' }} />

                {error && <p style={{ fontSize: '12px', color: '#c0392b', marginBottom: '12px' }}>{error}</p>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={labelStyle}>제목 *</label>
                        <input
                            style={inputStyle}
                            value={form.title}
                            onClick={e => e.stopPropagation()}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={labelStyle}>아티스트 *</label>
                        <input
                            style={inputStyle}
                            value={form.artist}
                            onClick={e => e.stopPropagation()}
                            onChange={e => setForm({ ...form, artist: e.target.value })}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f0ebe2' }}>
                    <button onClick={handleSave} disabled={loading} style={darkBtnStyle}>
                        {loading ? '저장 중...' : '저장'}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onClose(); }} style={ghostBtnStyle}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}

const overlayStyle  = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 };
const modalStyle    = { background: '#fff', borderRadius: '4px', padding: '28px', width: '360px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' };
const closeBtnStyle = { background: 'transparent', border: 'none', fontSize: '14px', color: '#aaa', cursor: 'pointer' };
const labelStyle    = { fontSize: '11px', color: '#999', letterSpacing: '0.06em' };
const inputStyle    = { width: '100%', padding: '10px 12px', border: '1px solid #e0dbd2', borderRadius: '2px', fontSize: '13px', background: '#faf9f6', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
const darkBtnStyle  = { padding: '9px 20px', background: '#1a1a1a', color: '#f5f0e8', border: 'none', borderRadius: '2px', fontSize: '12px', cursor: 'pointer', letterSpacing: '0.06em', fontFamily: 'inherit' };
const ghostBtnStyle = { padding: '9px 20px', background: 'transparent', color: '#888', border: '1px solid #ddd', borderRadius: '2px', fontSize: '12px', cursor: 'pointer', letterSpacing: '0.06em', fontFamily: 'inherit' };