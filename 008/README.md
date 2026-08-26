# 008 - Spring 실습 정리

Spring Boot 실습 자료를 정리하기 위한 폴더입니다.

현재는 `README.md`만 있으며, 이후 Spring 실습 프로젝트나 개념 정리 파일을 추가할 때 실제 구조에 맞춰 갱신합니다.

## 추천 폴더 구조

```text
008/
├─ spring-basic/
├─ spring-board/
├─ spring-security/
└─ README.md
```

## 정리하면 좋은 내용

| 주제 | 내용 |
| --- | --- |
| Spring 기본 | 프로젝트 구조, Controller, Service, Repository |
| 게시판 실습 | 게시글, 댓글, 파일 첨부, 페이징 |
| DB 연동 | MyBatis, JPA, SQL Mapper, 트랜잭션 |
| 인증/인가 | Spring Security, 세션, JWT |

## 정리 기준

- Spring 실습 프로젝트는 주제별 하위 폴더로 분리합니다.
- `build/`, `.gradle/`, `bin/` 같은 생성물은 Git 관리 대상에서 제외하는 것을 권장합니다.
- 기능이 추가되면 패키지 구조, 설정 파일, 실행 방법을 README에 함께 기록합니다.
