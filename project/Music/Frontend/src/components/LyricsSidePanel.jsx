import { useMemo, useEffect, useRef } from 'react';

export default function LyricsSidePanel({ song, currentTime }) {
    const activeRef = useRef(null);
    const containerRef = useRef(null);

    // 가사 파싱 로직 (기존 유지)
    const lines = useMemo(() => {
        if (!song?.lyrics) return [];
        return song.lyrics
            .split('\n')
            .map(line => {
                if (!line.trim()) return null;
                const idx = line.indexOf(':');
                // 시간 정보가 포함된 경우 처리 (예 - 01:23:가사내용)
                if (idx !== -1 && !isNaN(line.substring(0, idx).trim())) {
                    return line.substring(idx + 1).trim();
                }
                return line.trim();
            })
            .filter(Boolean);
    }, [song?.lyrics]);

    // 자동 스크롤 로직: currentTime에 맞춰 activeRef 위치로 이동
    useEffect(() => {
        // 사용자가 수동으로 가사를 읽고 싶을 때 방해하지 않으려면 
        // behavior를 'smooth'로 하고, 필요한 조건에서만 작동하게 합니다.
        if (activeRef.current && containerRef.current) {
            const container = containerRef.current;
            const active = activeRef.current;

            const offsetTop = active.offsetTop;
            // 가사가 컨테이너의 중앙에 오도록 계산
            const center = offsetTop - container.clientHeight / 2 + active.clientHeight / 2;

            container.scrollTo({
                top: center,
                behavior: 'smooth'
            });
        }
    }, [currentTime]); // 시간 업데이트마다 실행

    return (
        <div className="lyrics-panel">
            <p className="lyrics-panel-title">가사</p>
            <br />

            <hr className="lyrics-panel-divider" />
            <br />
            
            {/* overflow-y: auto 스타일이 적용되어 있어야 위아래 스크롤이 가능합니다 */}
            <div 
                className="lyrics-panel-body" 
                ref={containerRef}
                style={{ 
                    height: '100%', 
                    overflowY: 'auto', 
                    scrollBehavior: 'smooth',
                    paddingBottom: '50%' // 하단 가사도 중앙에 올 수 있게 여백 제공
                }}
            >
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
                        // 현재 어떤 줄이 활성화될지 결정하는 로직이 필요합니다.
                        // 일단은 모든 줄이 ref를 가지면 스크롤이 꼬이므로, 
                        // 특정 index(예: currentTime 기준)를 찾아 해당 줄에만 activeRef를 부여해야 합니다.
                        
                        // 예시: 재생 시간에 따른 index 매칭 로직이 없을 경우, 
                        // 사용자가 전체를 볼 수 있게 하려면 ref={null}로 두거나 특정 조건문을 넣어야 합니다.
                        const isActive = false; // 여기에 가사 하이라이트 조건 추가 가능

                        return (
                            <p
                                key={i}
                                // 모든 줄이 아닌, 현재 재생중인 줄에만 ref를 할당해야 스크롤이 정상 작동합니다.
                                ref={isActive ? activeRef : null} 
                                className={`lyrics-panel-line ${isActive ? 'active' : ''}`}
                                style={{
                                    marginBottom: '10px',
                                    lineHeight: '1.6',
                                    color: isActive ? '#000' : '#888' // 활성화된 줄만 강조
                                }}
                            >
                                {line}
                            </p>
                        );
                    })
                )}
            </div>
        </div>
    );
}