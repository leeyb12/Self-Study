# Game

React 기반 미니게임 모음과 일부 실시간 온라인 게임 기능을 구현한 프로젝트입니다.

## 구성

| 폴더 | 내용 |
| --- | --- |
| `backend/` | 점수, AI, 실시간 게임 API를 제공하는 Spring Boot 서버 |
| `frontend/` | 여러 게임 화면을 제공하는 React + Vite 클라이언트 |

## 주요 기능

- 체스, 오목, 테트리스, 스네이크, 지뢰찾기, 스도쿠, 2048 등 미니게임
- 온라인 틱택토, 온라인 퀴즈, 온라인 오목
- 점수 저장과 매치 기록
- STOMP 기반 실시간 통신
- 일부 3D 게임과 Three.js 활용

## 주요 기술

- Backend: Spring Boot, WebSocket/STOMP, Gradle
- Frontend: React, Vite, Three.js, STOMP client

## 실행 방법

Backend:

```powershell
cd project\Game\backend
.\gradlew.bat bootRun
```

Frontend:

```powershell
cd project\Game\frontend
npm install
npm run dev
```

DB 초기화 자료는 `backend/db/`를 확인합니다.
