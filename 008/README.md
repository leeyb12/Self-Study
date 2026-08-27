# 008 - Spring Boot / React 교재 실습

`실전! 스프링 부트 3 & 리액트로 시작하는 모던 웹 애플리케이션 개발` 교재의 장별 예제를 정리하는 폴더입니다.

Spring Boot 프로젝트 생성, Gradle 실행, 백엔드 구조, React 연동 흐름을 장별 실습으로 따라갑니다.

## 폴더 구조

```text
008/
├─ 실전! 스프링 부트 3 & 리액트로 시작하는 모던 웹 애플리케이션 개발/
│  ├─ Chapter 01/
│  │  ├─ gradle/
│  │  ├─ src/
│  │  ├─ build.gradle
│  │  ├─ gradlew
│  │  └─ gradlew.bat
│  ├─ Chapter 02/
│  │  └─ README.md
│  ├─ Chapter 03/
│  │  ├─ gradle/
│  │  ├─ src/
│  │  ├─ build.gradle
│  │  ├─ gradlew
│  │  └─ gradlew.bat
│  ├─ Chapter 04/
│  │  ├─ gradle/
│  │  ├─ src/
│  │  ├─ build.gradle
│  │  ├─ gradlew
│  │  └─ gradlew.bat
│  └─ Chapter 05/
│     ├─ gradle/
│     ├─ src/
│     ├─ build.gradle
│     ├─ gradlew
│     └─ gradlew.bat
└─ README.md
```

## 학습 내용

| 폴더 | 내용 |
| --- | --- |
| `Chapter 01/` | Spring Boot 프로젝트 생성과 기본 실행 구조 |
| `Chapter 02/` | 교재 개념/실습 내용 README 정리 |
| `Chapter 03/` | Spring Boot 애플리케이션 확장 실습 |
| `Chapter 04/` | Spring Boot 장별 프로젝트 실습 |
| `Chapter 05/` | Spring Boot 장별 프로젝트 실습 |

## 실행 방법

장별 Spring Boot 프로젝트 폴더에서 실행합니다.

```powershell
cd "008\실전! 스프링 부트 3 & 리액트로 시작하는 모던 웹 애플리케이션 개발\Chapter 05"
.\gradlew.bat bootRun
```

## 정리 기준

- 장별 실습은 `Chapter NN/` 폴더로 구분합니다.
- `build/`, `.gradle/`, `bin/` 같은 생성물은 Git 관리 대상에서 제외하는 것을 권장합니다.
- 기능이 추가되면 실행 방법, 패키지 구조, 설정 파일 변경점을 README에 함께 기록합니다.
