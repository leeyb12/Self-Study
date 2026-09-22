# React + Vite

Phonebook 프로젝트의 React 클라이언트입니다. 로그인 상태를 공유하고 연락처 CRUD, 검색과 그룹 필터 UI를 제공합니다.

## 주요 구성

- `context/AuthContext.jsx`: 로그인 사용자와 인증 상태 공유
- `api/authApi.js`, `api/contactApi.js`: 백엔드 요청 분리
- `ContactForm`, `ContactCard`: 입력과 목록 항목 표현
- `SearchBar`, `GroupFilter`, `GroupManager`: 검색과 분류 기능

## 핵심 개념

Context는 여러 컴포넌트가 필요한 인증 상태를 전달합니다. 폼은 입력값을 React 상태와 연결하고 제출 시 API 요청으로 변환합니다. 목록 변경 후에는 로컬 상태를 갱신하거나 서버에서 다시 조회해 화면과 데이터의 일관성을 유지합니다.

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
