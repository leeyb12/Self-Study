import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import LyricsSidePanel from "../components/LyricsSidePanel";
import LyricsModal from "../components/LyricsModal";
import UploadForm from "../components/UploadForm";
import ChatPanel from "../components/ChatPanel";
import Spinner from "../components/Spinner";
import "../styles/Player.css";
import usePlayerDesign from "../context/PlayerDesignContext";

function formatTime(sec) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

// 디자인 옵션은 `DesignSelector` 컴포넌트로 이동됨

/* ─────────────────────────────────────────────
   MarqueeTitle
   - 텍스트 > 컨테이너 → 마퀴 슬라이드 (왼쪽 정렬)
   - 텍스트 ≤ 컨테이너 → 중앙 고정, 애니메이션 없음
   - double-rAF: React DOM 반영 후 브라우저 레이아웃 확정 시점에 측정
───────────────────────────────────────────── */
function MarqueeTitle({ text, className, textClassName }) {
  const wrapRef = useRef(null);
  const textRef = useRef(null);
  const rafRef = useRef(null);
  const [isLong, setIsLong] = useState(false);

  useEffect(() => {
    setIsLong(false); // 먼저 애니메이션 OFF
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      // 1차: DOM 업데이트 반영
      rafRef.current = requestAnimationFrame(() => {
        // 2차: 레이아웃 계산 완료
        if (!wrapRef.current || !textRef.current) return;
        setIsLong(textRef.current.scrollWidth > wrapRef.current.clientWidth);
      });
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [text]);

  return (
    <div
      ref={wrapRef}
      className={`marquee-wrap ${isLong ? "is-long" : "is-short"} ${className ?? ""}`}
    >
      <span
        ref={textRef}
        className={`marquee-text ${isLong ? "marquee-active" : ""} ${textClassName ?? ""}`}
      >
        {text}
      </span>
    </div>
  );
}

/* ── 1. 벽걸이형 (wall) ── */
function WallPlayer(props) {
  const {
    currentSong,
    isPlaying,
    progress,
    currentTime,
    duration,
    currentIdx,
    sortedSongs,
    shufflePlay,
    repeatPlay,
    togglePlay,
    selectSong,
    seek,
    setShufflePlay,
    setRepeatPlay,
  } = props;
  return (
    <div style={wallWrapperStyle}>
      <div style={wallBodyStyle}>
        <div style={wallHookStyle} />
        <div style={cdPlatterStyle} onClick={togglePlay}>
          <div
            style={{
              ...cdDiscStyle,
              animation: isPlaying ? "spin 8s linear infinite" : "none",
            }}
          >
            {currentSong?.imageUrl ? (
              <img
                src={currentSong.imageUrl}
                alt="CD"
                style={cdCoverImgStyle}
              />
            ) : (
              <div style={cdPlaceholderStyle}>🎵</div>
            )}
            <div style={cdCenterHoleStyle} />
            <div style={cdShineOverlayStyle} />
          </div>
        </div>

        <MarqueeTitle
          text={currentSong?.title ?? "NO DISC"}
          className="wall-title-wrap"
          textClassName="wall-title-text"
        />

        <p style={artistStyle}>
          {currentSong?.artist ?? "Please select a song"}
        </p>

        <div style={progressContainerStyle} onClick={seek}>
          <div style={{ ...progressFillStyle, width: `${progress}%` }} />
        </div>
        <div style={timeDisplayStyle}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div style={controlGroupStyle}>
          <button
            style={{
              ...miniBtnStyle,
              color: shufflePlay ? "#845235" : "#a38f7e",
            }}
            onClick={() => setShufflePlay((p) => !p)}
          >
            ⇄
          </button>
          <button
            style={miniBtnStyle}
            disabled={currentIdx <= 0}
            onClick={() => selectSong(sortedSongs[currentIdx - 1])}
          >
            ⏮
          </button>
          <button style={mainPlayBtnStyle} onClick={togglePlay}>
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button
            style={miniBtnStyle}
            disabled={currentIdx >= sortedSongs.length - 1}
            onClick={() => selectSong(sortedSongs[currentIdx + 1])}
          >
            ⏭
          </button>
          <button
            style={{
              ...miniBtnStyle,
              color: repeatPlay ? "#845235" : "#a38f7e",
            }}
            onClick={() => setRepeatPlay((p) => !p)}
          >
            ↺
          </button>
        </div>
        <div style={speakerGrilleStyle}>
          {Array.from({ length: 15 }).map((_, i) => (
            <span key={i} style={grilleLineStyle} />
          ))}
        </div>
        <div style={pullStringContainerStyle} onClick={togglePlay}>
          <div
            style={{ ...stringLineStyle, height: isPlaying ? "65px" : "50px" }}
          />
          <div style={stringHandleStyle} />
        </div>
      </div>
      <style>{`
                @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
            `}</style>
    </div>
  );
}

/* ── 2. CD 워크맨 (walkman) ── */
function WalkmanPlayer(props) {
  const {
    currentSong,
    isPlaying,
    progress,
    currentTime,
    duration,
    currentIdx,
    sortedSongs,
    shufflePlay,
    repeatPlay,
    togglePlay,
    selectSong,
    seek,
    setShufflePlay,
    setRepeatPlay,
  } = props;
  return (
    <div className="pd-walkman">
      <div className="pd-walkman__lcd">
        <div className="pd-walkman__lcd-inner">
          {/* LCD 제목: 마퀴 적용 */}
          <MarqueeTitle
            text={currentSong?.title ?? "NO DISC"}
            className="walkman-title-wrap"
            textClassName="pd-walkman__lcd-title"
          />
          <span className="pd-walkman__lcd-time">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
      <div className="pd-walkman__body">
        <div className="pd-walkman__disc-area" onClick={togglePlay}>
          <div className={`pd-walkman__disc ${isPlaying ? "spinning" : ""}`}>
            {currentSong?.imageUrl ? (
              <img src={currentSong.imageUrl} alt="cover" />
            ) : (
              <div className="pd-walkman__disc-label">CD</div>
            )}
            <div className="pd-walkman__disc-hole" />
            <div className="pd-walkman__disc-shine" />
          </div>
        </div>
        <div className="pd-walkman__progress" onClick={seek}>
          <div
            className="pd-walkman__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="pd-walkman__controls">
          <button
            className={`pd-wbtn ${shufflePlay ? "active" : ""}`}
            onClick={() => setShufflePlay((p) => !p)}
          >
            ⇄
          </button>
          <button
            className="pd-wbtn"
            disabled={currentIdx <= 0}
            onClick={() => selectSong(sortedSongs[currentIdx - 1])}
          >
            ◀◀
          </button>
          <button className="pd-wbtn pd-wbtn--play" onClick={togglePlay}>
            {isPlaying ? "▐▐" : "▶"}
          </button>
          <button
            className="pd-wbtn"
            disabled={currentIdx >= sortedSongs.length - 1}
            onClick={() => selectSong(sortedSongs[currentIdx + 1])}
          >
            ▶▶
          </button>
          <button
            className={`pd-wbtn ${repeatPlay ? "active" : ""}`}
            onClick={() => setRepeatPlay((p) => !p)}
          >
            ↺
          </button>
        </div>
        <div className="pd-walkman__info">
          <p className="pd-walkman__artist">
            {currentSong?.artist ?? "Artist"}
          </p>
        </div>
      </div>
      <div className="pd-walkman__jack" />
    </div>
  );
}

/* ── 3. 붐박스 (boombox) ── */
function BoomboxPlayer(props) {
  const {
    currentSong,
    isPlaying,
    progress,
    currentTime,
    duration,
    currentIdx,
    sortedSongs,
    shufflePlay,
    repeatPlay,
    togglePlay,
    selectSong,
    seek,
    setShufflePlay,
    setRepeatPlay,
  } = props;
  return (
    <div className="pd-boombox">
      <div className="pd-boombox__handle" />
      <div className="pd-boombox__body">
        <div className="pd-boombox__speaker">
          <div className="pd-boombox__grille">
            {Array.from({ length: 25 }).map((_, i) => (
              <span key={i} />
            ))}
          </div>
          <div className="pd-boombox__woofer" />
        </div>
        <div className="pd-boombox__center">
          <div className="pd-boombox__display">
            <div className="pd-boombox__display-inner">
              <span className="pd-boombox__track-label">TRACK</span>
              <span className="pd-boombox__track-num">
                {currentIdx >= 0
                  ? String(currentIdx + 1).padStart(2, "0")
                  : "--"}
              </span>
              {/* LCD 디스플레이 제목: 마퀴 적용 */}
              <MarqueeTitle
                text={currentSong?.title ?? "NO TRACK"}
                className="boombox-title-wrap"
                textClassName="pd-boombox__display-title"
              />
              <span className="pd-boombox__display-time">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>
          <div className="pd-boombox__cassette">
            <div
              className={`pd-boombox__reel left ${isPlaying ? "spinning" : ""}`}
            />
            <div
              className={`pd-boombox__reel right ${isPlaying ? "spinning" : ""}`}
            />
          </div>
          <div className="pd-boombox__progress" onClick={seek}>
            <div
              className="pd-boombox__progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="pd-boombox__controls">
            <button
              className={`pd-bbtn ${shufflePlay ? "active" : ""}`}
              onClick={() => setShufflePlay((p) => !p)}
            >
              ⇄
            </button>
            <button
              className="pd-bbtn"
              disabled={currentIdx <= 0}
              onClick={() => selectSong(sortedSongs[currentIdx - 1])}
            >
              ◀◀
            </button>
            <button className="pd-bbtn pd-bbtn--play" onClick={togglePlay}>
              {isPlaying ? "▐▐" : "▶"}
            </button>
            <button
              className="pd-bbtn"
              disabled={currentIdx >= sortedSongs.length - 1}
              onClick={() => selectSong(sortedSongs[currentIdx + 1])}
            >
              ▶▶
            </button>
            <button
              className={`pd-bbtn ${repeatPlay ? "active" : ""}`}
              onClick={() => setRepeatPlay((p) => !p)}
            >
              ↺
            </button>
          </div>
          <div className="pd-boombox__knobs">
            <div className="pd-boombox__knob">
              <div className="pd-boombox__knob-dot" />
            </div>
            <div className="pd-boombox__knob">
              <div className="pd-boombox__knob-dot" />
            </div>
          </div>
        </div>
        <div className="pd-boombox__speaker">
          <div className="pd-boombox__grille">
            {Array.from({ length: 25 }).map((_, i) => (
              <span key={i} />
            ))}
          </div>
          <div className="pd-boombox__woofer" />
        </div>
      </div>
      <div className="pd-boombox__feet">
        <span />
        <span />
      </div>
    </div>
  );
}

/* ── 4. 턴테이블 (turntable) ── */
function TurntablePlayer(props) {
  const {
    currentSong,
    isPlaying,
    progress,
    currentTime,
    duration,
    currentIdx,
    sortedSongs,
    shufflePlay,
    repeatPlay,
    togglePlay,
    selectSong,
    seek,
    setShufflePlay,
    setRepeatPlay,
  } = props;
  return (
    <div className="pd-tt">
      <div className="pd-tt__body">
        <div className="pd-tt__platter-area">
          <div className="pd-tt__mat" />
          <div className={`pd-tt__record ${isPlaying ? "spinning" : ""}`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="pd-tt__groove" style={{ "--i": i }} />
            ))}
            <div className="pd-tt__label" onClick={togglePlay}>
              {currentSong?.imageUrl ? (
                <img src={currentSong.imageUrl} alt="cover" />
              ) : (
                <span className="pd-tt__label-text">
                  {currentSong?.title?.slice(0, 2) ?? "LP"}
                </span>
              )}
            </div>
            <div className="pd-tt__spindle" />
          </div>
          <div className={`pd-tt__tonearm-wrap ${isPlaying ? "playing" : ""}`}>
            <div className="pd-tt__tonearm" />
            <div className="pd-tt__headshell" />
          </div>
        </div>
        <div className="pd-tt__panel">
          <div className="pd-tt__info">
            {/* 패널 제목: 마퀴 적용 */}
            <MarqueeTitle
              text={currentSong?.title ?? "Side A"}
              className="tt-title-wrap"
              textClassName="pd-tt__title"
            />
            <p className="pd-tt__artist">{currentSong?.artist ?? "—"}</p>
          </div>
          <div className="pd-tt__progress" onClick={seek}>
            <div
              className="pd-tt__progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="pd-tt__time">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="pd-tt__controls">
            <button
              className={`pd-ttbtn ${shufflePlay ? "active" : ""}`}
              onClick={() => setShufflePlay((p) => !p)}
            >
              ⇄
            </button>
            <button
              className="pd-ttbtn"
              disabled={currentIdx <= 0}
              onClick={() => selectSong(sortedSongs[currentIdx - 1])}
            >
              ⏮
            </button>
            <button className="pd-ttbtn pd-ttbtn--play" onClick={togglePlay}>
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button
              className="pd-ttbtn"
              disabled={currentIdx >= sortedSongs.length - 1}
              onClick={() => selectSong(sortedSongs[currentIdx + 1])}
            >
              ⏭
            </button>
            <button
              className={`pd-ttbtn ${repeatPlay ? "active" : ""}`}
              onClick={() => setRepeatPlay((p) => !p)}
            >
              ↺
            </button>
          </div>
          <div className="pd-tt__speed-knobs">
            <div className="pd-tt__speed-knob">
              <span>33⅓</span>
              <div className="pd-tt__speed-dot" />
            </div>
            <div className="pd-tt__speed-knob">
              <span>45</span>
              <div className="pd-tt__speed-dot" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 5. 글래스 (glass) ── */
function GlassPlayer(props) {
  const {
    currentSong,
    isPlaying,
    progress,
    currentTime,
    duration,
    currentIdx,
    sortedSongs,
    shufflePlay,
    repeatPlay,
    togglePlay,
    selectSong,
    seek,
    setShufflePlay,
    setRepeatPlay,
  } = props;
  return (
    <div className="pd-glass">
      <div className="pd-glass__orb" />
      <div className="pd-glass__panel">
        <div className="pd-glass__cover" onClick={togglePlay}>
          {currentSong?.imageUrl ? (
            <img src={currentSong.imageUrl} alt="cover" />
          ) : (
            <div className="pd-glass__cover-icon">◈</div>
          )}
          <div
            className={`pd-glass__cover-ring ${isPlaying ? "active" : ""}`}
          />
        </div>
        <div className="pd-glass__info">
          {/* 글래스 제목: 마퀴 적용 */}
          <MarqueeTitle
            text={currentSong?.title ?? "곡을 선택하세요"}
            className="glass-title-wrap"
            textClassName="pd-glass__title"
          />
          <p className="pd-glass__artist">{currentSong?.artist ?? "—"}</p>
        </div>
        <div className="pd-glass__progress" onClick={seek}>
          <div
            className="pd-glass__progress-fill"
            style={{ width: `${progress}%` }}
          />
          <div
            className="pd-glass__progress-dot"
            style={{ left: `${progress}%` }}
          />
        </div>
        <div className="pd-glass__time">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="pd-glass__controls">
          <button
            className={`pd-gbtn ${shufflePlay ? "active" : ""}`}
            onClick={() => setShufflePlay((p) => !p)}
          >
            ⇄
          </button>
          <button
            className="pd-gbtn"
            disabled={currentIdx <= 0}
            onClick={() => selectSong(sortedSongs[currentIdx - 1])}
          >
            ⏮
          </button>
          <button className="pd-gbtn pd-gbtn--play" onClick={togglePlay}>
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button
            className="pd-gbtn"
            disabled={currentIdx >= sortedSongs.length - 1}
            onClick={() => selectSong(sortedSongs[currentIdx + 1])}
          >
            ⏭
          </button>
          <button
            className={`pd-gbtn ${repeatPlay ? "active" : ""}`}
            onClick={() => setRepeatPlay((p) => !p)}
          >
            ↺
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── 디자인 선택기 ── */
// DesignSelector 컴포넌트를 사용합니다 (파일: ../components/DesignSelector.jsx)

/* ── 메인 페이지 ── */
export default function PlayerPage() {
  const audioRef = useRef(null);
  const { isLoggedIn, authReady, username } = useAuth();

  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [sortMode, setSortMode] = useState("default");
  const [shufflePlay, setShufflePlay] = useState(false);
  const [repeatPlay, setRepeatPlay] = useState(false);
  const [lyricsModal, setLyricsModal] = useState(false);
  const [lyricsModalSong, setLyricsModalSong] = useState(null);
  const [activeAlbumName, setActiveAlbumName] = useState(null);
  const [playerDesign] = usePlayerDesign();

  const albumQueueKey = `playerQueue_${username}`;
  const albumNameKey = `playerAlbum_${username}`;

  // playerDesign은 PlayerDesignContext에서 로컬스토리지와 동기화됩니다.

  const fetchSongs = useCallback(
    async (autoPlay = false) => {
      if (!isLoggedIn) return;
      try {
        const res = await axios.get("/api/songs");
        const songList = res.data;
        let orderedSongs = songList;
        try {
          const savedQueue = JSON.parse(localStorage.getItem(albumQueueKey));
          if (Array.isArray(savedQueue) && savedQueue.length > 0) {
            const queuedSongs = savedQueue
              .map((id) => songList.find((s) => s.id === id))
              .filter(Boolean);
            orderedSongs = [
              ...queuedSongs,
              ...songList.filter((s) => !savedQueue.includes(s.id)),
            ];
            setActiveAlbumName(localStorage.getItem(albumNameKey));
          }
        } catch {
          /* ignore */
        }
        setSongs(orderedSongs);
        if (orderedSongs.length > 0) {
          if (autoPlay) {
            setCurrentSong(orderedSongs[0]);
            setIsPlaying(true);
          } else if (!currentSong) setCurrentSong(orderedSongs[0]);
        }
      } catch (e) {
        console.error("목록 로드 실패:", e);
      } finally {
        setLoading(false);
      }
    },
    [isLoggedIn, currentSong, albumQueueKey, albumNameKey],
  );

  useEffect(() => {
    if (authReady) fetchSongs();
  }, [authReady, fetchSongs]);
  useEffect(() => {
    if (username) setActiveAlbumName(localStorage.getItem(albumNameKey));
  }, [username, albumNameKey]);

  const sortedSongs = useMemo(() => {
    const list = [...songs];
    if (sortMode === "abc")
      return list.sort((a, b) => a.title.localeCompare(b.title, "ko"));
    if (sortMode === "random") return list.sort(() => Math.random() - 0.5);
    return list;
  }, [songs, sortMode]);

  const handleDelete = async (e, songId) => {
    e.stopPropagation();
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`/api/songs/${songId}`);
      if (currentSong?.id === songId) {
        setIsPlaying(false);
        setCurrentSong(null);
      }
      fetchSongs();
    } catch {
      alert("삭제 실패");
    }
  };

  const handleEdit = (e, song) => {
    e.stopPropagation();
    setLyricsModalSong(song);
    setLyricsModal(true);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    if (audio.src !== window.location.origin + currentSong.fileUrl) {
      audio.pause();
      audio.src = currentSong.fileUrl;
      audio.load();
    }
    if (isPlaying) {
      const p = audio.play();
      if (p !== undefined)
        p.catch((err) => {
          if (err.name !== "AbortError") console.error(err);
        });
    } else {
      audio.pause();
    }
  }, [currentSong, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => {
      setCurrentTime(audio.currentTime);
      setProgress(
        audio.duration ? (audio.currentTime / audio.duration) * 100 : 0,
      );
    };
    const meta = () => setDuration(audio.duration);
    const ended = () => {
      if (!currentSong || sortedSongs.length === 0) {
        setIsPlaying(false);
        return;
      }
      if (shufflePlay && sortedSongs.length > 1) {
        const candidates = sortedSongs.filter((s) => s.id !== currentSong.id);
        setCurrentSong(
          candidates[Math.floor(Math.random() * candidates.length)],
        );
        setIsPlaying(true);
        return;
      }
      const idx = sortedSongs.findIndex((s) => s.id === currentSong.id);
      if (idx >= 0 && idx < sortedSongs.length - 1) {
        setCurrentSong(sortedSongs[idx + 1]);
        setIsPlaying(true);
        return;
      }
      if (repeatPlay) {
        setCurrentSong(sortedSongs[0]);
        setIsPlaying(true);
        return;
      }
      setIsPlaying(false);
    };
    audio.addEventListener("timeupdate", update);
    audio.addEventListener("loadedmetadata", meta);
    audio.addEventListener("ended", ended);
    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("loadedmetadata", meta);
      audio.removeEventListener("ended", ended);
    };
  }, [currentSong, sortedSongs, shufflePlay, repeatPlay]);

  const togglePlay = () => setIsPlaying((v) => !v);
  const selectSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };
  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (audioRef.current)
      audioRef.current.currentTime =
        ((e.clientX - rect.left) / rect.width) * duration;
  };

  if (!authReady || loading)
    return (
      <div className="player-page">
        <Spinner />
      </div>
    );

  const currentIdx = sortedSongs.findIndex((s) => s.id === currentSong?.id);
  const playerProps = {
    currentSong,
    isPlaying,
    progress,
    currentTime,
    duration,
    currentIdx,
    sortedSongs,
    shufflePlay,
    repeatPlay,
    togglePlay,
    selectSong,
    seek,
    setShufflePlay,
    setRepeatPlay,
  };

  const PlayerCard = {
    wall: <WallPlayer {...playerProps} />,
    walkman: <WalkmanPlayer {...playerProps} />,
    boombox: <BoomboxPlayer {...playerProps} />,
    turntable: <TurntablePlayer {...playerProps} />,
    glass: <GlassPlayer {...playerProps} />,
  }[playerDesign] ?? <WallPlayer {...playerProps} />;

  return (
    <div className="player-page">
      <audio ref={audioRef} />
      <div className="player-layout">
        <div className="player-side-panel">
          <div className="panel-header">
            <span className="panel-title">PLAYLIST</span>
            <div className="sort-box">
              <button
                className={`action-btn ${sortMode === "abc" ? "active" : ""}`}
                onClick={() =>
                  setSortMode(sortMode === "abc" ? "default" : "abc")
                }
              >
                가나다
              </button>
              <button
                className={`action-btn ${sortMode === "random" ? "active" : ""}`}
                onClick={() =>
                  setSortMode(sortMode === "random" ? "default" : "random")
                }
              >
                랜덤
              </button>
            </div>
          </div>
          <div className="side-song-list">
            {sortedSongs.length === 0 ? (
              <p className="empty-text">업로드된 음악이 없습니다</p>
            ) : (
              sortedSongs.map((song) => (
                <div
                  key={song.id}
                  className={`side-song-item ${currentSong?.id === song.id ? "active" : ""}`}
                  onClick={() => selectSong(song)}
                >
                  <div className="song-info-mini">
                    <span className="song-name">{song.title}</span>
                    <span className="song-artist-mini">{song.artist}</span>
                  </div>
                  <div className="item-actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={(e) => handleEdit(e, song)}
                    >
                      수정
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={(e) => handleDelete(e, song.id)}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <UploadForm onUploaded={() => fetchSongs(true)} />
        </div>

        <div className="player-center">
          <div className={`player-card-wrap design-${playerDesign}`}>
            {PlayerCard}
          </div>
          {activeAlbumName && (
            <p className="album-now-playing">
              현재 재생 앨범: {activeAlbumName}
            </p>
          )}
        </div>

        <LyricsSidePanel song={currentSong} currentTime={currentTime} />
      </div>

      {lyricsModal && lyricsModalSong && (
        <LyricsModal
          song={lyricsModalSong}
          onClose={() => {
            setLyricsModal(false);
            setLyricsModalSong(null);
          }}
          onUpdated={(updatedSong) => {
            if (updatedSong === null) {
              if (currentSong?.id === lyricsModalSong.id) {
                setCurrentSong(null);
                setIsPlaying(false);
              }
            } else {
              if (currentSong?.id === updatedSong.id)
                setCurrentSong(updatedSong);
            }
            fetchSongs(false);
            setLyricsModal(false);
            setLyricsModalSong(null);
          }}
        />
      )}
      <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}

/* ── 벽걸이 인라인 스타일 ── */
const wallWrapperStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px 0",
};
const wallBodyStyle = {
  position: "relative",
  borderRadius: "32px",
  border: "1px solid #e2d8ce",
  padding: "40px 30px 24px 30px",
  width: "600px",
  boxShadow:
    "0 15px 35px rgba(74,55,40,0.08), inset 0 2px 4px rgba(255,255,255,0.8)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};
const wallHookStyle = {
  position: "absolute",
  top: "-12px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "32px",
  height: "16px",
  border: "3px solid #ebdccb",
  borderBottom: "none",
  borderRadius: "16px 16px 0 0",
};
const cdPlatterStyle = {
  width: "210px",
  height: "210px",
  background: "#f3ece4",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  boxShadow: "inset 0 4px 10px rgba(74,55,40,0.08)",
};
const cdDiscStyle = {
  position: "relative",
  width: "196px",
  height: "196px",
  borderRadius: "50%",
  overflow: "hidden",
  boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const cdCoverImgStyle = { width: "100%", height: "100%", objectFit: "cover" };
const cdPlaceholderStyle = {
  width: "100%",
  height: "100%",
  background: "linear-gradient(135deg,#ebdccb,#d9c5b2)",
  color: "#845235",
  fontSize: "36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const cdCenterHoleStyle = {
  position: "absolute",
  width: "30px",
  height: "30px",
  background: "#f3ece4",
  border: "4px solid #fcf9f5",
  borderRadius: "50%",
  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
};
const cdShineOverlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background:
    "linear-gradient(150deg,rgba(255,255,255,0.3) 0%,rgba(255,255,255,0) 45%,rgba(0,0,0,0.05) 50%,rgba(255,255,255,0.2) 55%,rgba(255,255,255,0) 100%)",
  pointerEvents: "none",
};
const artistStyle = {
  margin: "0 0 0 0",
  fontSize: "12px",
  color: "#8a7665",
  fontWeight: "500",
};
const progressContainerStyle = {
  width: "100%",
  height: "5px",
  background: "#ebdccb",
  borderRadius: "3px",
  marginTop: "16px",
  cursor: "pointer",
};
const progressFillStyle = {
  height: "100%",
  background: "#845235",
  borderRadius: "3px",
  transition: "width 0.1s linear",
};
const timeDisplayStyle = {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  fontSize: "11px",
  color: "#a38f7e",
  marginTop: "6px",
  fontVariantNumeric: "tabular-nums",
};
const controlGroupStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  marginTop: "15px",
  width: "100%",
};
const miniBtnStyle = {
  background: "none",
  border: "none",
  fontSize: "16px",
  color: "#a38f7e",
  cursor: "pointer",
  padding: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const mainPlayBtnStyle = {
  background: "#845235",
  color: "#fcf9f5",
  border: "none",
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  fontSize: "14px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 8px rgba(132,82,53,0.25)",
};
const speakerGrilleStyle = {
  display: "flex",
  gap: "5px",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "20px",
  width: "100%",
  height: "14px",
};
const grilleLineStyle = {
  width: "3px",
  height: "12px",
  background: "#ebdccb",
  borderRadius: "1.5px",
};
const pullStringContainerStyle = {
  position: "absolute",
  bottom: "-60px",
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  cursor: "pointer",
  zIndex: 10,
};
const stringLineStyle = {
  width: "2px",
  background: "#c4b5a5",
  transition: "height 0.15s ease-out",
};
const stringHandleStyle = {
  width: "12px",
  height: "12px",
  background: "#845235",
  borderRadius: "50%",
  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
};
