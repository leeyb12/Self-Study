# Fridge

냉장고 관련 Java/Spring 실습 흔적을 보관하는 폴더입니다.

## 현재 구조

```text
fridge/
└─ fridge/
   └─ bin/
      ├─ generated-sources/
      └─ generated-test-sources/
```

## 현재 상태

현재 폴더에는 원본 소스보다 IDE 또는 빌드 과정에서 생성된 `bin/` 산출물이 중심으로 남아 있습니다. 바로 실행 가능한 Spring 프로젝트 구조로 보기에는 `src/`, `build.gradle` 또는 `pom.xml` 같은 핵심 파일 확인이 더 필요합니다.

## 정리 방향

- 원본 소스가 남아 있다면 `src/main/java`, `src/main/resources` 구조로 복원합니다.
- Gradle 또는 Maven 설정 파일을 확인해 실행 방법을 README에 추가합니다.
- 단순 산출물만 남은 경우에는 학습 기록 보관 폴더로 유지하거나, 필요한 내용만 별도 문서로 옮깁니다.
