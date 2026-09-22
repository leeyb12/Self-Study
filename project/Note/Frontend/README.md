# React + TypeScript + Vite

AI Markdown 노트 프로젝트의 React 클라이언트입니다. 인증, 폴더 탐색, 노트 편집·읽기, PDF 보기, 첨부파일, 휴지통과 AI 채팅 화면을 제공합니다.

## 주요 구성

- `NoteWorkspace`, `NoteEditor`, `NoteReader`: 노트 선택·편집·읽기 흐름
- `FolderSidebar`, `NoteGrid`, `TrashGrid`: 폴더와 노트 목록 탐색
- `AiChat`: 현재 문맥을 사용한 AI 대화
- `PdfViewer`: 첨부 PDF 표시
- `api/client.ts`, `types.ts`: 서버 통신과 데이터 타입 계약

## 핵심 개념

TypeScript 타입은 API 응답과 컴포넌트 props의 형태를 명시해 데이터 불일치를 빠르게 발견합니다. 편집 중인 로컬 상태와 서버에 저장된 상태를 구분하고 저장 성공 후 동기화해야 합니다. Markdown 출력은 신뢰할 수 없는 HTML이 실행되지 않도록 정제 과정이 필요합니다.

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

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
