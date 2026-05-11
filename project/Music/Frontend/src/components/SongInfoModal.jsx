import { useState, useRef } from 'react';
import axios from 'axios';
import '../styles/SongInfoModal.css';

export default function SongInfoModal({ song, onClose, onSaved }) {
    const [form, setForm]                 = useState({ title: song.title, artist: song.artist });
    const [imageFile, setImageFile]       = useState(null);
    const [imagePreview, setImagePreview] = useState(song.imageUrl ?? null);
    const [loading, setLoading]           = useState(false);
    const [error, setError]               = useState('');
    const [success, setSuccess]           = useState('');
    const fileInputRef                    = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const handleSave = async (e) => {
        e.stopPropagation();
        if (!form.title.trim())  { setError('제목을 입력해주세요.'); return; }
        if (!form.artist.trim()) { setError('아티스트를 입력해주세요.'); return; }
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            let updatedSong = { ...song, title: form.title, artist: form.artist };

            const params = new URLSearchParams();
            params.append('title',  form.title);
            params.append('artist', form.artist);
            params.append('lyrics', song.lyrics ?? '');

            await axios.put(`/api/songs/${song.id}`, params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

            if (imageFile) {
                const formData = new FormData();
                formData.append('imageFile', imageFile);
                const res = await axios.put(`/api/songs/${song.id}/image`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                updatedSong = { ...updatedSong, imageUrl: res.data.imageUrl };
            }

            setSuccess('저장되었습니다.');
            setTimeout(() => { onSaved(updatedSong); onClose(); }, 800);
        } catch (err) {
            setError(err.response?.data?.error ?? '수정에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="info-overlay" onClick={onClose}>
            <div className="info-modal" onClick={e => e.stopPropagation()}>
                <div className="info-header">
                    <p className="info-title">음악 정보 수정</p>
                    <button className="info-close" onClick={(e) => { e.stopPropagation(); onClose(); }}>✕</button>
                </div>

                <hr className="info-divider" />

                {error   && <p className="info-error">{error}</p>}
                {success && <p className="info-success">{success}</p>}

                {/* 이미지 */}
                <div className="info-image-section">
                    <div
                        style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: '#1a1a1a', border: '2px solid #2c2c2c',
                            overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {imagePreview ? (
                            <img src={imagePreview} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f5f0e8' }} />
                        )}
                    </div>

                    <div className="info-image-right">
                        <p className="info-image-label">커버 이미지</p>
                        <p className="info-image-name">
                            {imageFile ? imageFile.name : song.imageUrl ? '현재 이미지 사용 중' : '이미지 없음'}
                        </p>
                        <button className="info-image-btn" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                            이미지 변경
                        </button>
                        {imageFile && (
                            <button className="info-image-btn" style={{ color: '#c0392b' }}
                                onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(song.imageUrl ?? null); }}>
                                취소
                            </button>
                        )}
                        <input ref={fileInputRef} type="file" accept="image/*" className="info-image-input" onChange={handleImageChange} />
                    </div>
                </div>

                {/* 제목 / 아티스트 */}
                <div className="info-fields">
                    <div className="info-field">
                        <label className="info-label">제목 *</label>
                        <input className="info-input" value={form.title}
                            onClick={e => e.stopPropagation()}
                            onChange={e => setForm({ ...form, title: e.target.value })} />
                    </div>
                    <div className="info-field">
                        <label className="info-label">아티스트 *</label>
                        <input className="info-input" value={form.artist}
                            onClick={e => e.stopPropagation()}
                            onChange={e => setForm({ ...form, artist: e.target.value })} />
                    </div>
                </div>

                <div className="info-buttons">
                    <button className="info-btn-dark" disabled={loading} onClick={handleSave}>
                        {loading ? '저장 중...' : '저장'}
                    </button>
                    <button className="info-btn-ghost" onClick={(e) => { e.stopPropagation(); onClose(); }}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}