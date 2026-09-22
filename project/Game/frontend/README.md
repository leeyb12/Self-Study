# React + Vite

미니게임과 온라인 게임을 제공하는 React 클라이언트입니다. 각 게임은 `games/`에 독립된 컴포넌트로 구성하고 `registry.js`에서 목록과 진입 정보를 관리합니다.

## 주요 구조

- `games/`: 보드 게임, 퍼즐, 아케이드와 3D 게임 구현
- `hooks/useGameLoop.js`: 프레임 단위 갱신이 필요한 게임 루프
- `hooks/useStompRoom.js`: 실시간 게임방 구독과 메시지 처리
- `components/ScorePanel.jsx`: 점수 표시와 저장 UI
- `api/`: 점수 및 AI 백엔드 호출

## 핵심 개념

React 상태는 메뉴와 턴 기반 게임에 적합하고, 빠르게 변하는 프레임 값은 `requestAnimationFrame`과 ref를 함께 사용할 수 있습니다. 온라인 게임에서는 서버 메시지 순서와 방 상태를 기준으로 화면을 동기화합니다.

## 실행

```powershell
npm install
npm run dev
```

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
