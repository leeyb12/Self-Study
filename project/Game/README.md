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

## 게임 구조 개념

- 게임 상태는 보드, 점수, 현재 차례와 종료 여부처럼 한 시점의 규칙 정보를 나타냅니다.
- 게임 루프는 입력 처리, 상태 갱신, 충돌 판정과 화면 렌더링을 반복합니다.
- 실시간 게임에서는 서버가 방과 참가자의 기준 상태를 관리하고 클라이언트가 이벤트를 주고받습니다.
- Three.js 게임은 장면, 카메라, 조명, 메시와 렌더러의 관계로 3D 화면을 구성합니다.
- 점수 저장 시 게임 종류, 난이도와 사용자 정보를 함께 기록해야 비교 기준이 명확해집니다.

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
