# Gyeongnam

경남 빅데이터 관련 Java/Spring Boot 백엔드 실습 흔적을 보관하는 폴더입니다.

## 현재 구조

```text
gyeongnam/
└─ Backend/
   └─ bin/
      ├─ generated-sources/
      ├─ generated-test-sources/
      └─ main/
         ├─ com/gyeongnam/bigdata/
         └─ templates/
```

## 현재 상태

현재는 `Backend/bin` 아래의 컴파일 산출물과 템플릿 흔적이 중심입니다. 실행 가능한 백엔드 프로젝트로 정리하려면 원본 `src` 구조, 빌드 설정, 애플리케이션 설정 파일을 먼저 확인해야 합니다.

## 정리 방향

- 원본 소스가 확보되면 `Backend/src/main/java`, `Backend/src/main/resources` 구조로 정리합니다.
- Spring Boot 실행 파일과 설정 파일이 확인되면 실행 방법을 추가합니다.
- 데이터셋, API, 화면 템플릿이 연결되는 경우 `docs/`에 기능 흐름을 따로 정리합니다.
