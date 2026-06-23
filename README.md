# Self-Study

웹 개발 학습 과정에서 진행한 강의 실습·예제·코딩 문제 풀이와 풀스택 토이 프로젝트를 모아 둔 개인 학습 저장소입니다.

> Python → 웹 기초(HTML/CSS/JS) → 혼공 시리즈 → Java → Spring Boot + React 풀스택 프로젝트로 이어지는 학습 흐름을 담고 있습니다.

---

## 디렉터리 구조

| 폴더 | 주제 | 내용 |
|------|------|------|
| `000/` | **Python** | `python1`(알고리즘: 그래프·그리디), `python2`(기초 문법·연습문제·코딩 실습) |
| `001/` | **웹 기초** | `HTML-CSS1`, `HTML-CSS-JavaScript1~4` — HTML/CSS/JavaScript 단계별 실습과 미니 프로젝트(WCBCafe 등) |
| `002/` | **혼공 시리즈** | `혼공파이썬`, `혼공첫프With파이썬`, `혼공데With파이썬`, `혼공머신러닝+딥러닝`, `혼공자바스크립트` — 「혼자 공부하는」 교재 실습 및 정리 노트 |
| `003/` | (작업 예정) | — |
| `004/` | **Java** | `Java01` — Eclipse 기반 Java 학습 워크스페이스 |
| `005/` ~ `007/` | (작업 예정) | — |
| `project/` | **풀스택 프로젝트** | Spring Boot + React 기반 토이 프로젝트 모음 (아래 참조) |

> `002` 폴더의 각 강좌에는 `WordNote.md` / `word*.md` 형태의 학습 단어·개념 정리 노트가 함께 포함되어 있습니다.

---

## 풀스택 프로젝트 (`project/`)

세 프로젝트 모두 **Spring Boot 4.1.0 (JDK 21) + React 19 + Oracle Database** 구성을 공유하며, JWT 기반 인증을 사용합니다. 각 프로젝트는 `Backend/`(Gradle), `Frontend/`(Vite 또는 CRA) 디렉터리로 구성됩니다.

### Music — 음악 게시판 & 플레이어
풀스택 음악 관리 및 커뮤니티 플랫폼. 회원 인증, 음악 업로드/재생, 게시판, 실시간 채팅(WebSocket)을 제공합니다.

- **Backend**: Spring Boot, Spring Security, JPA, WebSocket
- **Frontend**: React 19 (Create React App)
- **DB**: Oracle 11g XE · **파일 저장**: `C:/music_storage/`
- 자세한 내용: [project/Music/README.md](project/Music/README.md)

### ecommerce — 전자상거래 플랫폼
도메인 주도(domain-per-feature) 구조의 쇼핑몰. 회원·상품·장바구니·주문·리뷰·통계(analytics)·배치(batch) 도메인으로 구성됩니다.

- **Backend**: Spring Boot, Spring Security, JPA, Spring Batch, JWT
- **Frontend**: React 19 + Vite, Zustand, React Router, React Hook Form, Recharts
- **DB**: Oracle XE

### phonebook — 연락처 관리
그룹별 연락처를 관리하는 주소록 애플리케이션.

- **Backend**: Spring Boot, Spring Security, JPA, JWT
- **Frontend**: React 19 + Vite, MUI(@mui/material), Emotion
- **DB**: Oracle XE

---

## 기술 스택 요약

| 구분 | 기술 |
|------|------|
| 언어 | Python, JavaScript, Java 21 |
| 프론트엔드 | HTML/CSS, React 19, Vite, MUI, Zustand, Recharts |
| 백엔드 | Spring Boot 4.1.0, Spring Security, Spring Data JPA, Spring Batch |
| 데이터베이스 | Oracle Database (XE) |
| 인증 | JWT |
| 빌드 도구 | Gradle, npm/Vite |
| 머신러닝 | scikit-learn / 딥러닝 (혼공 머신러닝+딥러닝, Jupyter Notebook) |

---

## 실행 방법 (프로젝트 공통)

```bash
# Backend (Gradle)
cd project/<프로젝트명>/Backend
./gradlew bootRun

# Frontend
cd project/<프로젝트명>/Frontend
npm install
npm run dev   # Vite 프로젝트 (ecommerce, phonebook)
npm start     # CRA 프로젝트 (Music)
```

> 실행 전 Oracle DB 연결 정보를 각 프로젝트의 `Backend/src/main/resources/application.properties`에서 환경에 맞게 설정해야 합니다.

---

## 참고

- 본 저장소는 학습 목적의 개인 아카이브로, 강의 실습 코드와 자체 프로젝트가 함께 포함되어 있습니다.
- `node_modules/`, `build/`, `.gradle/` 등 생성물은 저장소에 포함되어 있을 수 있으나 빌드 시 재생성됩니다.
