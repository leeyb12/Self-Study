import { useState } from 'react';

const HELP_SECTIONS = [
    {
        icon: '🎵',
        title: '음악 플레이어',
        items: [
            'CD를 클릭하거나 ▶ 버튼을 눌러 재생 / 일시정지할 수 있습니다.',
            '줄(아래 원)을 클릭해도 재생됩니다.',
            '하단 프로그레스 바를 클릭하면 원하는 구간으로 이동합니다.',
            '곡 목록에서 곡을 클릭하면 해당 곡이 재생됩니다.',
            '곡이 끝나면 다음 곡이 자동으로 재생됩니다.',
            '이전/다음 버튼으로 곡을 이동할 수 있습니다.',
            '네비게이션 바의 디자인 선택 버튼으로 플레이어 외형을 변경할 수 있습니다.',
        ],
    },
    {
        icon: '🎨',
        title: '플레이어 디자인',
        items: [
            '네비게이션 바의 상단에 있는 디자인 선택 버튼으로 플레이어 스타일을 변경할 수 있습니다.',
            '벽걸이형 - MUJI 아날로그 감성의 클래식한 라디오 스타일입니다.',
            'CD 워크맨 - 90년대 Y2K 감성의 메탈릭 휴대용 플레이어입니다.',
            '붐박스 - 80년대 힙합 문화를 대표하는 레트로 스타일입니다.',
            '턴테이블 - 미드센추리 모던 디자인의 레코드 플레이어입니다.',
            '글래스 - 미래형 투명 디자인으로 세련되고 현대적인 느낌입니다.',
            '선택된 디자인은 자동으로 저장되어 다시 방문할 때도 유지됩니다.',
        ],
    },
    {
        icon: '🌙',
        title: '테마',
        items: [
            '네비게이션 바의 우상단에 있는 테마 선택 드롭다운으로 앱의 색상 테마를 변경할 수 있습니다.',
            'Mood White - 밝고 깔끔한 기본 화이트 테마입니다.',
            'Retro Boombox - 80년대 레트로 붐박스 감성의 따뜻한 톤입니다.',
            'Cyber Walkman - 사이버펑크 감성의 워크맨 스타일입니다.',
            'Mid-Century Vintage - 미드센추리 빈티지의 우아한 컬러입니다.',
            'All Black Studio - 검은색 기반의 프로페셔널한 스튜디오 스타일입니다.',
            'Cyberpunk - 네온 강조의 미래형 사이버펑크 테마입니다.',
            'Glassmorphism - 투명한 글래스 모르피즘 스타일입니다.',
            'High-Teen Pink - 밝고 생기 넘치는 핑크 톤의 청소년 감성입니다.',
            'Ocean Refresh - 차분한 바다 색상의 신선한 테마입니다.',
            'City Pop Sunset - 시티팝 감성의 따뜻한 석양 톤입니다.',
            '플레이어 디자인과 테마를 함께 조합하여 개인만의 스타일을 만들 수 있습니다.',
        ],
    },
    {
        icon: '⬆️',
        title: '음악 업로드',
        items: [
            '+ 음악 업로드 버튼을 클릭해 파일을 선택합니다.',
            'MP3 파일을 선택하면 제목, 아티스트, 커버 이미지가 자동으로 입력됩니다.',
            '커버 이미지가 없으면 직접 선택하거나 나중에 추가할 수 있습니다.',
            '업로드 후 바로 재생 버튼을 누르면 즉시 재생됩니다.',
            '로그인한 사용자만 본인이 업로드한 곡을 볼 수 있습니다.',
        ],
    },
    {
        icon: '📝',
        title: '정보관리',
        items: [
            '곡 목록의 [수정] 버튼을 클릭하면 곡 가사와 수정 버튼이 있는 창이 열립니다.',
            '[가사 수정] 버튼으로 가사를 입력하거나 수정할 수 있습니다.',
            '가사는 줄바꿈으로 구분하여 입력하면 됩니다.',
            '[정보 수정] 버튼으로 제목, 아티스트, 커버 이미지를 변경할 수 있습니다.',
            'CD를 클릭하면 이미지를 바로 추가할 수 있습니다.',
        ],
    },
    {
        icon: '📋',
        title: '게시판',
        items: [
            '상단 메뉴의 [게시판]을 클릭해 이동합니다.',
            '로그인 후 [글쓰기] 버튼으로 글을 작성할 수 있습니다.',
            '게시글에 이미지나 오디오 파일을 첨부할 수 있습니다.',
            '본인이 작성한 글만 수정 / 삭제할 수 있습니다.',
            '댓글도 본인 것만 삭제할 수 있습니다.',
            '비로그인 사용자는 글과 댓글을 읽을 수 있습니다.',
        ],
    },
];

export default function HelpModal({ onClose }) {
    const [activeIdx, setActiveIdx] = useState(0);

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={e => e.stopPropagation()}>

                {/* 헤더 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#111111' }}>
                            도움말
                        </p>
                        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#767676', fontWeight: 500 }}>
                            MUJI PLAYER 사용 가이드
                        </p>
                    </div>
                    <button onClick={onClose} style={closeBtnStyle}>✕</button>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #eeeeee', margin: '0 0 20px' }} />

                <div style={{ display: 'flex', gap: '20px', height: '360px' }}>

                    {/* 왼쪽 메뉴 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '160px', flexShrink: 0 }}>
                        {HELP_SECTIONS.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIdx(i)}
                                style={{
                                    padding: '10px 14px',
                                    // 활성화 시 보라색 톤 배경, 비활성화 시 투명
                                    background: activeIdx === i ? '#ece6ff' : 'transparent',
                                    // 활성화 시 진한 보라색 글씨, 비활성화 시 부드러운 흑색
                                    color:      activeIdx === i ? '#5f3dc4' : '#555555',
                                    fontWeight: activeIdx === i ? '600' : '400',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontFamily: 'inherit',
                                    letterSpacing: '0.02em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                <span style={{ fontSize: '14px' }}>{s.icon}</span>
                                <span>{s.title}</span>
                            </button>
                        ))}
                    </div>

                    {/* 오른쪽 내용 */}
                    <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#111111', margin: '0 0 16px' }}>
                            {HELP_SECTIONS[activeIdx].icon} {HELP_SECTIONS[activeIdx].title}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {HELP_SECTIONS[activeIdx].items.map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                    <span style={{ fontSize: '11px', color: '#999999', minWidth: '18px', marginTop: '3px', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <p style={{ fontSize: '13px', color: '#333333', lineHeight: '1.6', margin: 0 }}>
                                        {item}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #eeeeee', margin: '20px 0 16px' }} />

                <p style={{ fontSize: '11px', color: '#999999', textAlign: 'center', margin: 0, letterSpacing: '0.04em' }}>
                    추가 문의는 게시판을 이용해주세요
                </p>
            </div>
        </div>
    );
}

// 명시적인 화이트 테마 스타일링 고정
const overlayStyle = { 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    background: 'rgba(0, 0, 0, 0.45)', // 뒷배경 비침을 줄이기 위해 어두운 레이어 살짝 강화
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    zIndex: 1000 
};

const modalStyle = { 
    background: '#ffffff', // 완전한 흰색 배경 고정
    borderRadius: '8px', 
    border: '1px solid #e2e8f0', 
    padding: '28px', 
    width: '770px', 
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' // 좀 더 부드럽고 깊은 그림자 효과
};

const closeBtnStyle = { 
    background: 'transparent', 
    border: 'none', 
    fontSize: '16px', 
    color: '#888888', 
    cursor: 'pointer',
    padding: '4px'
};