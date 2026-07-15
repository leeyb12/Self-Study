# Project

Spring Boot 백엔드와 React 프론트엔드를 조합한 개인 프로젝트 모음입니다.

## 프로젝트 목록

| 폴더 | 설명 | 주요 기술 |
| --- | --- | --- |
| `ecommerce/` | 쇼핑몰 흐름을 구현한 전자상거래 프로젝트 | Spring Boot, JPA, React, Vite, Zustand, Recharts |
| `Game/` | 여러 미니게임과 일부 온라인 게임 기능을 모은 프로젝트 | Spring Boot, WebSocket/STOMP, React, Vite, Three.js |
| `Music/` | 음악 재생, 업로드, 게시판, 채팅 기능을 가진 프로젝트 | Spring Boot, React, WebSocket, JWT |
| `Note/` | Markdown 노트, 폴더, 첨부파일, AI 기능을 다루는 노트 프로젝트 | Spring Boot, MariaDB, React, TypeScript, Ollama |
| `phonebook/` | 로그인 기반 연락처 관리 프로젝트 | Spring Boot, JPA, React, Vite, MUI |

## 공통 구조

대부분의 프로젝트는 다음 구조를 따릅니다.

```text
ProjectName/
  Backend/
  Frontend/
```

일부 프로젝트는 폴더명이 소문자(`backend`, `frontend`)이거나 `sql`, `docs`, `uploads` 같은 보조 폴더를 포함합니다.

## 공통 실행 방법

Spring Boot 백엔드:

```powershell
cd project\<프로젝트명>\Backend
.\gradlew.bat bootRun
```

Vite 프론트엔드:

```powershell
cd project\<프로젝트명>\Frontend
npm install
npm run dev
```

프로젝트마다 DB, 포트, 환경 설정이 다를 수 있으므로 각 프로젝트 README와 `application.properties`를 함께 확인합니다.
