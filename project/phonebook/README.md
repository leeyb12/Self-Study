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

## 도메인 개념

- 연락처는 이름과 전화번호 같은 기본 정보에 사용자와 그룹의 관계를 함께 가집니다.
- 검색은 입력 문자열을 상태로 관리하고 전체 목록 또는 서버 조회 결과를 필터링합니다.
- 그룹 필터는 연락처 분류 기준이며 생성·수정·삭제 시 기존 연락처와의 관계를 고려해야 합니다.
- JWT 인증에서는 로그인 후 받은 토큰을 요청에 포함하고 서버가 서명과 만료 시간을 검증합니다.

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
