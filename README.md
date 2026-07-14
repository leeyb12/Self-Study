# Self-Study

개인 학습 과정에서 작성한 강의 실습, 코딩테스트 풀이, CS 정리 노트, Java/Spring/React 프로젝트를 모아 둔 저장소입니다.

Python 기초와 문제 풀이부터 HTML/CSS/JavaScript, Java, 컴퓨터공학 이론, 풀스택 프로젝트까지 학습 흐름별로 폴더를 나누어 관리합니다.

---

## 디렉터리 구조

| 폴더 | 주제 | 내용 |
| --- | --- | --- |
| `000/` | Python 문제 풀이 | 프로그래머스 스타일의 Python 문제 풀이. `python0`에는 Day 01-10 풀이가 정리되어 있습니다. |
| `001/` | 웹 기초 | HTML, CSS, JavaScript 단계별 실습과 미니 프로젝트, WCBCafe 예제 |
| `002/` | 혼공 시리즈 | Python, 데이터 분석, 머신러닝/딥러닝, JavaScript 교재 실습 및 정리 |
| `003/` | Java | `ThisIsJava` 교재 기반 Java 문법 실습 |
| `004/` | CS 이론 노트 | 컴퓨터 구조, 운영체제, 네트워크, 디자인 패턴, 컴퓨터 과학 정리 |
| `005/` | 학습 예정 | 추후 학습 자료 보관용 |
| `006/` | 학습 예정 | 추후 학습 자료 보관용 |
| `007/` | 학습 예정 | 추후 학습 자료 보관용 |
| `project/` | 풀스택 프로젝트 | Spring Boot + React 기반 개인 프로젝트 모음 |

---

## 주요 학습 폴더

### `000/` Python 문제 풀이

`000/python0`에는 Day 단위로 Python 코딩테스트 풀이가 정리되어 있습니다.

```text
000/
├─ python0/
│  ├─ Day 01 출력/
│  ├─ Day 02 출력, 연산/
│  ├─ Day 03 연산/
│  ├─ Day 04 연산, 조건문/
│  ├─ Day 05 조건문/
│  ├─ Day 06 조건문, 반복문/
│  ├─ Day 07 반복문/
│  ├─ Day 08 조건문, 문자열/
│  ├─ Day 09 문자열/
│  └─ Day 10 문자열/
└─ python2/
```

### `001/` HTML/CSS/JavaScript

웹 기초 실습을 단계별로 모아 둔 폴더입니다.

```text
001/
├─ HTML-CSS1/
├─ HTML-CSS-JavaScript1/
├─ HTML-CSS-JavaScript2/
├─ HTML-CSS-JavaScript3/
└─ HTML-CSS-JavaScript4/
```

### `002/` 혼공 시리즈

교재 기반 실습 코드와 정리 노트가 들어 있습니다.

```text
002/
├─ 혼공파이썬/
├─ 혼공첫프With파이썬/
├─ 혼공데With파이썬/
├─ 혼공머신러닝+딥러닝/
└─ 혼공자바스크립트/
```

포함 자료 예시:

- Python 기초 문법 실습
- JavaScript 문법 실습
- Jupyter Notebook 기반 머신러닝/딥러닝 실습
- `WordNote.md`, `word*.md` 형태의 개념 정리

### `003/` Java

`ThisIsJava` 교재 예제를 중심으로 Java 문법을 실습합니다.

```text
003/
└─ ThisIsJava/
   ├─ chap02/
   └─ chap05/
```

### `004/` CS 이론 노트

면접 및 전공 기초 학습을 위한 Markdown 정리 노트입니다.

```text
004/
├─ 면접을 위한 CS 전공지식 노트/
├─ 소프트웨어 세상을 여는 컴퓨터 과학/
├─ 쉽게 배우는 데이터 통신과 컴퓨터 네트워크/
└─ 혼자 공부하는 컴퓨터 구조 + 운영체제/
```

정리 주제:

- 디자인 패턴과 프로그래밍 패러다임
- 네트워크
- 운영체제
- 컴퓨터 구조
- 데이터 표현
- 명령어와 CPU 동작 원리

---

## 프로젝트

`project/`에는 Spring Boot 백엔드와 React 프론트엔드를 사용하는 프로젝트들이 들어 있습니다.

```text
project/
├─ ecommerce/
├─ Game/
├─ Music/
├─ Note/
└─ phonebook/
```

| 프로젝트 | 설명 | 주요 기술 |
| --- | --- | --- |
| `Music` | 음악 게시판 및 플레이어. 음악 업로드, 재생, 게시판, 댓글 | Spring Boot, Spring Security, JPA,  React CRA, Oracle |
| `ecommerce` | 전자상거래 플랫폼. 회원, 상품, 장바구니, 주문, 리뷰, 통계/배치 기능 | Spring Boot, Spring Security, JPA, Spring Batch, React, Vite, Zustand, Recharts |
| `phonebook` | 그룹 기반 연락처 관리 애플리케이션 | Spring Boot, Spring Security, JPA, React, Vite, MUI |
| `Note` | AI 노트 애플리케이션. Markdown 노트, 폴더, 첨부파일, 휴지통, PDF, Ollama 기반 AI 기능 | Spring Boot, MariaDB, React, TypeScript, Vite, Ollama |
| `Game` | 여러 미니게임을 모은 웹 게임 프로젝트 | Spring Boot, React, Vite, Three.js, STOMP |

---

## 기술 스택 요약

| 구분 | 기술 |
| --- | --- |
| Language | Python, JavaScript, TypeScript, Java |
| Frontend | HTML, CSS, React 19, Vite, Create React App, MUI, Zustand, Recharts, Three.js |
| Backend | Spring Boot, Spring Security, Spring Data JPA, Spring Batch |
| Database | Oracle XE, MariaDB |
| Build / Tooling | Gradle, npm, Vite, ESLint |
| AI / Data | Ollama, scikit-learn, Jupyter Notebook |
| Auth | JWT |

---

## 실행 방법

프로젝트마다 세부 설정은 다르지만, 일반적인 실행 흐름은 아래와 같습니다.

### Spring Boot Backend

```bash
cd project/<프로젝트명>/Backend
./gradlew bootRun
```

Windows PowerShell에서는 다음처럼 실행할 수 있습니다.

```powershell
cd project\<프로젝트명>\Backend
.\gradlew.bat bootRun
```

`Game` 프로젝트는 백엔드 폴더명이 소문자입니다.

```powershell
cd project\Game\backend
.\gradlew.bat bootRun
```

### React Frontend

Vite 프로젝트:

```bash
cd project/<프로젝트명>/Frontend
npm install
npm run dev
```

Music 프로젝트는 Create React App 기반입니다.

```bash
cd project/Music/Frontend
npm install
npm start
```

Game 프로젝트는 프론트엔드 폴더명이 소문자입니다.

```bash
cd project/Game/frontend
npm install
npm run dev
```

---

## 참고

- 이 저장소는 개인 학습 및 포트폴리오 정리를 위한 공간입니다.
- `node_modules/`, `build/`, `.gradle/` 같은 생성물은 저장소 관리 대상에서 제외하는 것을 권장합니다.
- 프로젝트별 DB 연결 정보와 환경 변수는 각 프로젝트의 `application.properties`, SQL 파일, README를 기준으로 확인합니다.
