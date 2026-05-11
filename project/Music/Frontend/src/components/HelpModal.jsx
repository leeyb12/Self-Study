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
        title: '가사 관리',
        items: [
            '곡 목록의 [가사] 버튼을 클릭하면 가사 창이 열립니다.',
            '[가사 수정] 버튼으로 가사를 입력하거나 수정할 수 있습니다.',
            '가사는 줄바꿈으로 구분하여 입력하면 됩니다.',
            '[정보 수정] 버튼으로 제목, 아티스트, 커버 이미지를 변경할 수 있습니다.',
            'CD를 클릭하면 이미지를 바로 추가할 수 있습니다.',
        ],
    },
    {
        icon: '💬',
        title: '실시간 채팅',
        items: [
            '[채팅 열기] 버튼으로 채팅 패널을 엽니다.',
            '[전체] 탭에서 접속한 모든 사용자와 대화할 수 있습니다.',
            '접속자 탭을 클릭하면 해당 사용자와 1:1 채팅을 할 수 있습니다.',
            'Enter 키로 메시지를 전송할 수 있습니다.',
            '로그인한 사용자만 채팅에 참여할 수 있습니다.',
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
                        <p style={{ margin: 0, fontSize: '15px', fontWeight: 500, color: '#1a1a1a' }}>
                            도움말
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#aaa' }}>
                            MUJI PLAYER 사용 가이드
                        </p>
                    </div>
                    <button onClick={onClose} style={closeBtnStyle}>✕</button>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #f0ebe2', margin: '0 0 20px' }} />

                <div style={{ display: 'flex', gap: '20px', height: '360px' }}>

                    {/* 왼쪽 메뉴 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '140px', flexShrink: 0 }}>
                        {HELP_SECTIONS.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIdx(i)}
                                style={{
                                    padding: '10px 12px',
                                    background: activeIdx === i ? '#1a1a1a' : 'transparent',
                                    color:      activeIdx === i ? '#f5f0e8' : '#555',
                                    border: 'none',
                                    borderRadius: '2px',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontFamily: 'inherit',
                                    letterSpacing: '0.04em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'background 0.15s',
                                }}
                            >
                                <span>{s.icon}</span>
                                <span>{s.title}</span>
                            </button>
                        ))}
                    </div>

                    {/* 오른쪽 내용 */}
                    <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a', margin: '0 0 16px' }}>
                            {HELP_SECTIONS[activeIdx].icon} {HELP_SECTIONS[activeIdx].title}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {HELP_SECTIONS[activeIdx].items.map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                    <span style={{ fontSize: '11px', color: '#bbb', minWidth: '18px', marginTop: '2px', fontVariantNumeric: 'tabular-nums' }}>
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <p style={{ fontSize: '13px', color: '#333', lineHeight: '1.7', margin: 0 }}>
                                        {item}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #f0ebe2', margin: '20px 0 16px' }} />

                <p style={{ fontSize: '11px', color: '#bbb', textAlign: 'center', margin: 0, letterSpacing: '0.04em' }}>
                    추가 문의는 게시판을 이용해주세요
                </p>
            </div>
        </div>
    );
}

const overlayStyle  = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400 };
const modalStyle    = { background: '#fff', borderRadius: '4px', border: '1px solid #ede8df', padding: '28px', width: '560px', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.08)' };
const closeBtnStyle = { background: 'transparent', border: 'none', fontSize: '14px', color: '#aaa', cursor: 'pointer' };