import { useMemo } from 'react';

export default function LyricsOverlay({ lyrics, currentTime }) {

    const lines = useMemo(() => {
        if (!lyrics) return [];
        return lyrics
            .split('\n')
            .map(line => {
                const colonIdx = line.indexOf(':');
                if (colonIdx === -1) return null;
                const time = parseFloat(line.substring(0, colonIdx));
                const text = line.substring(colonIdx + 1).trim();
                return { time, text };
            })
            .filter(Boolean)
            .sort((a, b) => a.time - b.time);
    }, [lyrics]);

    const activeIndex = useMemo(() => {
        let lo = 0, hi = lines.length - 1, idx = -1;
        while (lo <= hi) {
            const mid = (lo + hi) >> 1;
            if (lines[mid].time <= currentTime) { idx = mid; lo = mid + 1; }
            else hi = mid - 1;
        }
        return idx;
    }, [lines, currentTime]);

    if (lines.length === 0) return null;

    const visibleStart = Math.max(0, activeIndex - 2);
    const visibleEnd   = Math.min(lines.length, activeIndex + 4);
    const visibleLines = lines.slice(visibleStart, visibleEnd);

    return (
        <div className="lyrics-overlay-bar">
            {visibleLines.map((line, i) => (
                <p
                    key={visibleStart + i}
                    className={`lyrics-line-bar ${visibleStart + i === activeIndex ? 'active' : ''}`}
                >
                    {line.text}
                </p>
            ))}
        </div>
    );
}