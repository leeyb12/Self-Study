# Phonebook

로그인 기반 연락처 관리 프로젝트입니다. 연락처 등록, 수정, 삭제, 검색, 그룹 관리 기능을 백엔드 API와 React 화면으로 나누어 구현합니다.

## 구성

| 폴더 | 내용 |
| --- | --- |
| `Backend/` | Spring Boot API 서버 |
| `Frontend/` | React + Vite + MUI 클라이언트 |

## 주요 기능

- 회원 가입과 로그인
- JWT 기반 인증
- 연락처 등록, 조회, 수정, 삭제
- 그룹 생성과 그룹별 필터
- 검색 바와 연락처 카드 UI

## 주요 기술

- Backend: Spring Boot, Spring Security, Spring Data JPA, Gradle
- Frontend: React, Vite, MUI, Axios

## 실행 방법

Backend:

```powershell
cd project\phonebook\Backend
.\gradlew.bat bootRun
```

Frontend:

```powershell
cd project\phonebook\Frontend
npm install
npm run dev
```

DB 스키마나 초기 SQL은 `Backend/sql/`을 확인합니다.
