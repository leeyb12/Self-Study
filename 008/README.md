# 008 - Spring 실습

Spring Boot 기반 실습 프로젝트를 정리하는 폴더입니다. 현재 `springcodeproject`가 들어 있으며, 게시판과 회원, 댓글, 파일 첨부 관련 모델과 Mapper 구조를 연습합니다.

## 폴더 구조

```text
008/
├─ springcodeproject/
│  ├─ gradle/
│  ├─ src/
│  │  ├─ main/
│  │  │  ├─ java/
│  │  │  └─ resources/
│  │  └─ test/
│  ├─ build.gradle
│  ├─ gradlew
│  ├─ gradlew.bat
│  └─ settings.gradle
└─ README.md
```

## 주요 패키지

```text
net.gentledot.springcodeproject/
├─ model/
│  ├─ board/
│  ├─ member/
│  ├─ reply/
│  ├─ request/
│  ├─ upload/
│  └─ vo/
└─ repository/
   └─ board/
```

## 포함 내용

| 구분 | 내용 |
| --- | --- |
| `model/board` | 게시글, 페이지 기준, 검색 조건, 첨부파일 모델 |
| `model/member` | 회원 모델 |
| `model/reply` | 댓글 모델 |
| `model/request` | 파일 요청 모델 |
| `model/upload` | 업로드 첨부파일 모델 |
| `model/vo` | 상품 VO 실습 |
| `repository/board` | 게시판 및 첨부파일 Mapper |

## 실행 방법

```powershell
cd 008\springcodeproject
.\gradlew.bat bootRun
```

실행 전 `src/main/resources/application.properties`의 DB 연결 정보와 포트 설정을 확인합니다.

## 정리 기준

- Spring 실습 프로젝트는 `springcodeproject` 안에서 관리합니다.
- 생성물인 `build/`, `.gradle/`, `bin/`은 Git 관리 대상에서 제외하는 것을 권장합니다.
- 기능이 추가되면 모델, Mapper, 설정 파일 변경점을 README에 함께 기록합니다.
