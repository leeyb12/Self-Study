import { useMemo, useEffect, useRef } from 'react';

export default function LyricsSidePanel({ song, currentTime }) {

    const bottomRef  = useRef(null);
    const activeRef  = useRef(null);
    const containerRef = useRef(null);

    // 가사 파싱
    const lines = useMemo(() => {
        if (!song?.lyrics) return [];
        return song.lyrics
            .split('\n')
            .map(line => {
                const idx = line.indexOf(':');
                if (idx === -1) return null;
                const time = parseFloat(line.substring(0, idx));
                const text = line.substring(idx + 1).trim();
                if (!text) return null;
                return { time, text };
            })
            .filter(Boolean)
            .sort((a, b) => a.time - b.time);
    }, [song?.lyrics]);

    // 현재 활성 인덱스
    const activeIndex = useMemo(() => {
        let lo = 0, hi = lines.length - 1, idx = -1;
        while (lo <= hi) {
            const mid = (lo + hi) >> 1;
            if (lines[mid].time <= currentTime) { idx = mid; lo = mid + 1; }
            else hi = mid - 1;
        }
        return idx;
    }, [lines, currentTime]);

    // 활성 가사로 자동 스크롤
    useEffect(() => {
        if (activeRef.current && containerRef.current) {
            const container = containerRef.current;
            const active    = activeRef.current;
            const offsetTop = active.offsetTop;
            const center    = offsetTop - container.clientHeight / 2 + active.clientHeight / 2;
            container.scrollTo({ top: center, behavior: 'smooth' });
        }
    }, [activeIndex]);

    return (
        <div className="lyrics-panel">
            <p className="lyrics-panel-title">가사</p>

            {song ? (
                <>
                    <p className="lyrics-panel-song">{song.title}</p>
                    <p className="lyrics-panel-artist">{song.artist}</p>
                    <hr className="lyrics-panel-divider" />
                </>
            ) : null}

            <div className="lyrics-panel-body" ref={containerRef}>
                {!song ? (
                    <div className="lyrics-panel-empty">
                        <p>곡을 선택하면</p>
                        <p>가사가 표시됩니다</p>
                    </div>
                ) : lines.length === 0 ? (
                    <div className="lyrics-panel-empty">
                        <p>가사가 없습니다</p>
                        <p>가사 버튼으로 추가해보세요</p>
                    </div>
                ) : (
                    lines.map((line, i) => {
                        const isActive = i === activeIndex;
                        const isNear   = Math.abs(i - activeIndex) <= 2 && !isActive;
                        return (
                            <p
                                key={i}
                                ref={isActive ? activeRef : null}
                                className={[
                                    'lyrics-panel-line',
                                    isActive ? 'active' : '',
                                    isNear   ? 'near'   : '',
                                ].join(' ')}
                            >
                                {line.text}
                            </p>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}