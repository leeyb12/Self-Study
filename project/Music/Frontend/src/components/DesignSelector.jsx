import React from 'react';
import { usePlayerDesign as _usePlayerDesign } from '../context/PlayerDesignContext';

const DESIGN_OPTIONS = [
  { value: 'wall', label: '벽걸이형', desc: 'MUJI 아날로그' },
  { value: 'walkman', label: 'CD 워크맨', desc: 'Y2K 메탈릭' },
  { value: 'boombox', label: '붐박스', desc: '80s 레트로' },
  { value: 'turntable', label: '턴테이블', desc: '미드센추리' },
  { value: 'glass', label: '글래스', desc: '미래형 투명' },
];

export default function DesignSelector({ value: propValue, onChange: propOnChange, compact }) {
  const [design, setDesign] = _usePlayerDesign();
  const value = propValue ?? design;
  const onChange = propOnChange ?? setDesign;

  return (
    <div 
      className="design-selector-container" 
      style={{ 
        display: 'flex', 
        alignItems: 'center',
        padding: '4px',
        // 테마 색상 변수 사용
        backgroundColor: 'var(--surface-variant)', 
        border: '1px solid var(--border-soft)',
        borderRadius: '8px',
        width: 'fit-content'
      }}
    >
      {DESIGN_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          style={{ 
            padding: '6px 12px',
            cursor: 'pointer',
            border: 'none',
            borderRadius: '6px',
            // 선택된 항목은 강조 색상(primary/surface), 아닐 경우 투명
            backgroundColor: value === opt.value ? 'var(--surface)' : 'transparent',
            color: value === opt.value ? 'var(--text)' : 'var(--muted)',
            boxShadow: value === opt.value ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
            fontWeight: value === opt.value ? '600' : 'normal',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}