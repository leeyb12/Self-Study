import { useState, useEffect, useRef, useCallback } from 'react';

// 고정된 설정 데이터 및 헬퍼 함수 분리
const CODE_ONLY_EXTS = new Set(['py', 'js', 'css', 'txt', 'json', 'md']);

const isCodeOnly = (src) => {
  const ext = src.split('.').pop().toLowerCase();
  return CODE_ONLY_EXTS.has(ext);
};

const detectLang = (src) => {
  const ext = src.split('.').pop().toLowerCase();
  return { html: 'html', css: 'css', js: 'javascript', py: 'python', json: 'json', md: 'markdown', txt: 'plaintext' }[ext] || 'plaintext';
};

const langLabel = (lang) => {
  return { html: 'HTML', css: 'CSS', javascript: 'JS', python: 'Python', plaintext: 'TEXT' }[lang] || lang.toUpperCase();
};

const langClass = (lang) => {
  return { html: 'lang-html', css: 'lang-css', javascript: 'lang-js', python: 'lang-py', plaintext: 'lang-text' }[lang] || 'lang-text';
};

// 샘플 링크 데이터 (테스트용 예시)
const SAMPLE_LINKS = [
  { id: 1, title: '웹 페이지 미리보기', src: '/index.html' },
  { id: 2, title: '파이썬 스크립트 코드', src: '/script.py' },
];

const FileViewer = () => {
  // ── 1. 상태(State) 정의 ──
  const [viewMode, setViewMode] = useState('home'); // 'home' | 'viewer'
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'code'
  
  // 마우스 오버 팝업 미리보기 상태
  const [preview, setPreview] = useState({ visible: false, src: '' });
  // 메인 뷰어 상태
  const [viewer, setViewer] = useState({ src: '', url: '' });
  // 코드 탭 상세 데이터 상태
  const [codeData, setCodeData] = useState({ loading: false, text: '', error: null, lang: 'plaintext' });
  // 복사 버튼 상태
  const [copiedStatus, setCopiedStatus] = useState('normal'); // 'normal' | 'success' | 'fail'

  // ── 2. 타이머 및 이전 상태 캐싱을 위한 Ref ──
  const hideTimer = useRef(null);
  const showTimer = useRef(null);
  const lastLoadedSrc = useRef(null);
  const codeRef = useRef(null); // hljs 타겟팅용

  // ── 3. 마우스 오버 팝업 (Preview) 기능 ──
  const showPreview = (src) => {
    clearTimeout(hideTimer.current);
    if (src === preview.src && preview.visible) return;
    setPreview({ visible: true, src });
  };

  const scheduleHide = () => {
    clearTimeout(showTimer.current);
    hideTimer.current = setTimeout(() => {
      setPreview(prev => ({ ...prev, visible: false }));
      // 트랜지션 애니메이션 대기 후 src 초기화
      setTimeout(() => {
        setPreview(prev => (!prev.visible ? { visible: false, src: '' } : prev));
      }, 350);
    }, 200);
  };

  const cancelHide = () => clearTimeout(hideTimer.current);

  // ── 4. 메인 뷰어 열기/닫기 ──
  const openViewer = (src) => {
    clearTimeout(hideTimer.current);
    clearTimeout(showTimer.current);
    setPreview({ visible: false, src: '' });

    setViewer({ src, url: src });
    setViewMode('viewer');

    if (isCodeOnly(src)) {
      lastLoadedSrc.current = null;
      setActiveTab('code');
    } else {
      setActiveTab('preview');
    }
  };

  const goHome = () => {
    setViewMode('home');
    setTimeout(() => {
      setViewer({ src: '', url: '' });
      setCodeData({ loading: false, text: '', error: null, lang: 'plaintext' });
    }, 300);
  };

  // ── 5. 코드 비동기 로드 기능 ──
  const loadCodeXHR = useCallback((src, lang) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', src, true);
    xhr.responseType = 'text';
    xhr.overrideMimeType('text/plain; charset=utf-8');
    xhr.onload = () => {
      if (xhr.status === 200 || (xhr.status === 0 && xhr.responseText)) {
        setCodeData({ loading: false, text: xhr.responseText, error: null, lang });
      } else {
        setCodeData({ loading: false, text: '', error: `XHR status: ${xhr.status}`, lang });
      }
    };
    xhr.onerror = () => {
      setCodeData({ loading: false, text: '', error: '네트워크 오류 — file:// 환경에서는 로컬 서버가 필요해요', lang });
    };
    xhr.send();
  }, []);

  const loadCode = useCallback(async (src) => {
    if (lastLoadedSrc.current === src) return;
    lastLoadedSrc.current = src;

    const lang = detectLang(src);
    setCodeData({ loading: true, text: '', error: null, lang });

    try {
      const res = await fetch(src, { mode: 'same-origin', cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      setCodeData({ loading: false, text, error: null, lang });
    } catch {
      // fetch 실패 시 XHR 백업 실행
      loadCodeXHR(src, lang);
    }
  }, [loadCodeXHR]);

  useEffect(() => {
  if (viewMode !== 'viewer' || activeTab !== 'code' || !viewer.src) return;

  // 1. 변수 선언
  let isCurrent = true; 

  const startLoadingCode = async () => {
    // 2. 만약 loadCode 내부에서 직접 setState를 한다면 
    // loadCode 함수 자체를 수정하거나, 아래처럼 여기서 체크 로직을 써야 합니다.
    await loadCode(viewer.src);
    
    // 3. 변수 사용 (이 부분이 들어가야 에러가 사라집니다!)
    if (!isCurrent) {
      console.log("이전 요청이므로 무시합니다.");
      return;
    }
  };

  startLoadingCode();

  return () => {
    // 4. 클린업 시 false로 변경
    isCurrent = false; 
  };
}, [viewMode, activeTab, viewer.src, loadCode]);

  // 코드 텍스트가 바뀔 때 하이라이팅 처리 (hljs)
  useEffect(() => {
    if (codeRef.current && codeData.text && window.hljs) {
      window.hljs.highlightElement(codeRef.current);
    }
  }, [codeData.text, codeData.lang]);

  // 컴포넌트 해제 시 타이머 제거 (메모리 누수 방지)
  useEffect(() => {
    return () => {
      clearTimeout(hideTimer.current);
      clearTimeout(showTimer.current);
    };
  }, []);

  // ── 6. 복사 기능 ──
  const handleCopy = async () => {
    if (!codeData.text) return;
    try {
      await navigator.clipboard.writeText(codeData.text);
      setCopiedStatus('success');
      setTimeout(() => setCopiedStatus('normal'), 2000);
    } catch {
      setCopiedStatus('fail');
      setTimeout(() => setCopiedStatus('normal'), 2000);
    }
  };

  // ── 7. UI 바인딩 변수들 ──
  const filename = viewer.src.split('/').pop();
  const currentLangLabel = langLabel(codeData.lang);
  const currentLangClass = langClass(codeData.lang);
  const isPreviewDisabled = viewer.src ? isCodeOnly(viewer.src) : false;

  return (
    <div className="app-container">
      {/* ── 홈 뷰 영역 ── */}
      <div className={`view-panel home-view ${viewMode === 'home' ? '' : 'hidden'}`}>
        <h2>파일 목록</h2>
        <ul className="link-list">
          {SAMPLE_LINKS.map(link => (
            <li 
              key={link.id}
              className="link-item"
              onMouseEnter={() => {
                clearTimeout(hideTimer.current);
                showTimer.current = setTimeout(() => showPreview(link.src), 150);
              }}
              onMouseLeave={scheduleHide}
              onClick={(e) => { e.preventDefault(); openViewer(link.src); }}
            >
              {link.title}
            </li>
          ))}
        </ul>
      </div>

      {/* ── 마우스 오버 팝업 패널 ── */}
      <div 
        className={`preview-panel ${preview.visible ? 'visible' : ''}`}
        onMouseEnter={cancelHide}
        onMouseLeave={scheduleHide}
      >
        <div className="preview-url">{preview.src}</div>
        {preview.src && <iframe src={preview.src} title="Popup Preview" className="preview-iframe" />}
      </div>

      {/* ── 메인 뷰어 패널 ── */}
      <div className={`view-panel viewer-view ${viewMode === 'viewer' ? 'visible' : ''}`}>
        <div className="viewer-navbar">
          <button onClick={goHome} className="btn-home">🏠 홈으로</button>
          <span className="viewer-url">{viewer.url}</span>
          <a href={viewer.src} target="_blank" rel="noreferrer" className="btn-newtab">새 탭에서 열기</a>
        </div>

        {/* 탭 헤더 */}
        <div className="tab-header">
          <button 
            disabled={isPreviewDisabled}
            className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
            style={{ opacity: isPreviewDisabled ? 0.35 : 1 }}
            title={isPreviewDisabled ? '이 파일은 미리보기를 지원하지 않습니다' : ''}
            onClick={() => setActiveTab('preview')}
          >
            미리보기
          </button>
          <button 
            className={`tab-btn ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => {
              lastLoadedSrc.current = null;
              setActiveTab('code');
            }}
          >
            코드 보기
          </button>
        </div>

        {/* 탭 콘텐츠 영역 */}
        <div className="tab-content">
          {/* 미리보기 탭 */}
          {activeTab === 'preview' && !isPreviewDisabled && (
            <iframe src={viewer.src} title="Main Viewer" className="viewer-iframe" />
          )}

          {/* 코드 보기 탭 */}
          {activeTab === 'code' && (
            <div className="code-panel visible">
              <div className="code-meta">
                <span className="code-filename">{filename}</span>
                <span className={`code-lang-badge ${currentLangClass}`}>{currentLangLabel}</span>
                <button onClick={handleCopy} className={`btn-copy ${copiedStatus !== 'normal' ? 'copied' : ''}`}>
                  {copiedStatus === 'normal' && '📋 복사'}
                  {copiedStatus === 'success' && '✅ 복사됨!'}
                  {copiedStatus === 'fail' && '❌ 실패'}
                </button>
              </div>

              <div className="code-scroll">
                {codeData.loading && (
                  <div className="code-loading">
                    <div className="code-loading-spinner"></div>
                    <p>코드 불러오는 중...</p>
                  </div>
                )}

                {codeData.error && (
                  <div className="code-error">
                    <div className="err-icon">⚠️</div>
                    <p>파일을 불러올 수 없어요</p>
                    <p className="err-msg-sub">{codeData.error}</p>
                    <p className="err-msg-tip">💡 VS Code Live Server 또는 로컬 서버로 열면 해결됩니다</p>
                  </div>
                )}

                {!codeData.loading && !codeData.error && codeData.text && (
                  <pre>
                    <code ref={codeRef} className={`language-${codeData.lang}`}>
                      {codeData.text}
                    </code>
                  </pre>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileViewer;