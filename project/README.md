# Project

Spring Boot 백엔드와 React 프론트엔드를 조합한 개인 프로젝트 모음입니다. 쇼핑몰, 게임, 음악 플레이어, AI 노트, 연락처 관리처럼 서로 다른 도메인을 실습하며 백엔드 API, 프론트엔드 화면, DB 연동, 인증, 파일 업로드, WebSocket 등을 함께 다룹니다.

## 전체 구조

```text
project/
├─ ecommerce/          # 전자상거래 프로젝트
│  ├─ Backend/
│  └─ Frontend/
├─ fridge/             # 냉장고 관련 실습 보관 폴더
│  └─ fridge/
├─ Game/               # 미니게임 모음
│  ├─ backend/
│  └─ frontend/
├─ gyeongnam/          # 경남 빅데이터 관련 백엔드 실습 흔적
│  └─ Backend/
├─ Music/              # 음악 플레이어 / 게시판 프로젝트
│  ├─ Backend/
│  ├─ Frontend/
│  ├─ docs/
│  └─ sql/
├─ Note/               # AI Markdown 노트 프로젝트
│  ├─ Backend/
│  ├─ Frontend/
│  ├─ docs/
│  └─ uploads/
└─ phonebook/          # 연락처 관리 프로젝트
   ├─ Backend/
   └─ Frontend/
```

## 프로젝트 목록

| 폴더 | 설명 | 구조 | 주요 기술 |
| --- | --- | --- | --- |
| `ecommerce/` | 쇼핑몰 흐름을 구현한 전자상거래 프로젝트 | `Backend`, `Frontend` | Spring Boot, JPA, React, Vite, Zustand, Recharts |
| `Game/` | 여러 미니게임과 일부 온라인 게임 기능을 모은 프로젝트 | `backend`, `frontend` | Spring Boot, WebSocket/STOMP, React, Vite, Three.js |
| `Music/` | 음악 재생, 업로드, 게시판, 채팅 기능을 가진 프로젝트 | `Backend`, `Frontend`, `docs`, `sql` | Spring Boot, React CRA, WebSocket, JWT, Oracle |
| `Note/` | Markdown 노트, 폴더, 첨부파일, AI 기능을 다루는 노트 프로젝트 | `Backend`, `Frontend`, `docs`, `uploads` | Spring Boot, MariaDB, React, TypeScript, Vite, Ollama |
| `phonebook/` | 로그인 기반 연락처 관리 프로젝트 | `Backend`, `Frontend` | Spring Boot, JPA, React, Vite, MUI |
| `fridge/` | 냉장고 관련 실습 보관 폴더 | `fridge` 하위에 `bin` 산출물 중심 | Java/Spring 실습 흔적 |
| `gyeongnam/` | 경남 빅데이터 관련 백엔드 실습 보관 폴더 | `Backend` 하위에 `bin` 산출물 중심 | Java/Spring Boot 실습 흔적 |

## 보관 폴더 정리 상태

`fridge/`와 `gyeongnam/`은 현재 원본 소스보다 IDE 빌드 산출물인 `bin/` 중심으로 남아 있습니다. 실행 가능한 프로젝트로 복원하려면 `src/`, `build.gradle` 또는 `pom.xml`, 설정 파일을 다시 확인해 프로젝트 구조를 재구성하는 과정이 필요합니다.

현재 README에서는 이 두 폴더를 삭제하지 않고 학습 흔적 보관 위치로 표시합니다.

## 폴더 규칙

- `Backend/` 또는 `backend/`: Spring Boot API 서버입니다.
- `Frontend/` 또는 `frontend/`: React 화면입니다.
- `sql/`: 데이터베이스 스키마, 테이블, 시퀀스 생성 SQL을 보관합니다.
- `docs/`: 프로젝트 기술서, 구현 화면, 스크린샷 같은 문서를 보관합니다.
- `uploads/`: 로컬 업로드 파일 저장 위치입니다. 실제 운영 데이터나 큰 파일은 Git 관리에서 제외하는 것이 좋습니다.
- `bin/`, `build/`, `dist/`, `node_modules/`, `.gradle/`: 빌드 산출물이므로 Git 관리 대상에서 제외하는 것을 권장합니다.

## 공통 실행 방법

프로젝트마다 DB, 포트, 환경 설정이 다릅니다. 실행 전 각 프로젝트 README와 `application.properties`를 먼저 확인합니다.

### Spring Boot Backend

일반 프로젝트:

```powershell
cd project\<프로젝트명>\Backend
.\gradlew.bat bootRun
```

`Game` 프로젝트:

```powershell
cd project\Game\backend
.\gradlew.bat bootRun
```

### React Frontend

Vite 프로젝트:

```powershell
cd project\<프로젝트명>\Frontend
npm install
npm run dev
```

Music 프로젝트는 Create React App 기반입니다.

```powershell
cd project\Music\Frontend
npm install
npm start
```

`Game` 프로젝트:

```powershell
cd project\Game\frontend
npm install
npm run dev
```

## README 관리 기준

- 프로젝트 루트 README에는 기능, 기술 스택, 실행 방법, 구현 화면을 정리합니다.
- `Backend/README.md`에는 API 서버 역할, 주요 패키지, 실행 방법을 정리합니다.
- `Frontend/README.md`에는 화면 구성, 주요 컴포넌트, 실행 방법을 정리합니다.
- `docs/screenshots/`에는 README에서 사용하는 구현 화면 이미지를 보관합니다.
- 구조가 아직 불완전한 프로젝트는 현재 상태를 숨기지 않고 보관 폴더 또는 정리 대기 폴더로 표시합니다.
