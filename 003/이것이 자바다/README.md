# 이것이 자바다 실습

이것이 자바다 교재 예제를 장별 Eclipse Java 프로젝트로 정리합니다.

## 프로젝트 구성

| 폴더 | 예제 |
| --- | --- |
| `chap02/src/exam02_char/` | `CharExample.java`: 문자 리터럴과 `char` 타입 |
| `chap05/src/sec05/exam01_string_equals/` | `StringEqualsExample.java`: 문자열 동등 비교 |
| `chap05/src/sec06/exam01_array_bylist/` | 배열 값 목록으로 생성 |
| `chap05/src/sec06/exam02_array_bynew/` | `new` 연산자를 사용한 배열 생성 |
| `chap05/src/sec06/exam03_array_length/` | 배열 길이 확인 |
| `chap05/src/sec06/exam04_main_argument/` | `main` 메서드의 문자열 배열 인수 |
| `chap05/src/sec06/exam05_array_in_array/` | 다차원 배열 |

## 예제에서 확인할 개념

- `char`는 작은따옴표로 표현하는 하나의 유니코드 문자를 저장합니다.
- `String`은 객체이므로 문자열 내용의 동일 여부를 `equals()`로 확인합니다.
- 배열은 생성 시 길이가 정해지고 `length` 필드로 요소 수를 확인합니다.
- `main(String[] args)`의 `args`에는 프로그램 실행 시 전달한 문자열 인수가 순서대로 들어갑니다.
- 다차원 배열은 배열을 요소로 갖는 배열이며 각 행의 길이가 서로 다를 수도 있습니다.

## 관리 기준

- 실행할 Java 소스는 각 프로젝트의 `src/`에서 확인합니다.
- `.classpath`, `.project`, `.settings/`는 Eclipse 프로젝트 설정입니다.
- `bin/`과 `.metadata/`는 학습 소스가 아닌 생성 파일입니다.
