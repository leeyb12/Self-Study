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

## 복원에 필요한 개념

- 컴파일 산출물은 실행 결과에 가깝고 유지보수에 필요한 원본 Java 소스와 빌드 정의를 대신하지 못합니다.
- 빅데이터 프로젝트는 데이터 출처, 수집 주기, 컬럼 의미와 전처리 과정을 알아야 결과를 검증할 수 있습니다.
- 서버 템플릿은 백엔드가 데이터를 HTML에 결합하는 방식이므로 Controller가 전달한 모델 정보가 필요합니다.
- 소스 복원 시 API, 템플릿, 데이터 처리와 저장소의 연결 흐름을 먼저 확인합니다.

## 정리 방향

- 원본 소스가 확보되면 `Backend/src/main/java`, `Backend/src/main/resources` 구조로 정리합니다.
- Spring Boot 실행 파일과 설정 파일이 확인되면 실행 방법을 추가합니다.
- 데이터셋, API, 화면 템플릿이 연결되는 경우 `docs/`에 기능 흐름을 따로 정리합니다.
