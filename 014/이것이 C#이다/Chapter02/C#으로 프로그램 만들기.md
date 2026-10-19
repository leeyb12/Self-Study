## C# 첫 프로그램과 컴파일 과정
> "컴파일은 소스코드를 분석하여 기계어 코드로 변환하는 과정이며, C# 컴파일러는 소스코드를 IL코드로 바꾸고 CLR이 이를 다시 기계어로 변환해 실행한다."

### 1. 컴파일 과정 이해
| 단계 | 역할 및 설명 |
|------|--------------|
| 어휘 분석 | 소스 코드 내 기호, 단어 등 최소 단위로 분리(ex: <mark>a</mark>, <mark>=</mark>, <mark>3</mark>, <mark>+</mark>, <mark>b</mark>, <mark>;</mark>)
| 구문 분석 | 어휘들이 올바른 문법적 순서로 배열되었는지 검사 (예: 할당 연산자 <mark>=</mark>가 있어야 함) |
| 의미 분석 | 의미상 오류 확인 (ex: 숫자와 숫자의 덧셈은 허용되지만, 숫자와 텍스트 덧셈은 오류) |

- 컴파일러는 이 세 단계를 통해 소스코드 오류를 찾아내고, 오류가 없으면 기계어로 변환 가능한 중간 코드 생성

### 2. C# 컴파일러와 실행 메커니즘
- C# 컴파일러: C# 소스코드를 IL(Intermediate Language) 코드로 변환하는 프로그램
- IL 코드: 중간 언어 코드로, 직접 실행 불가 -> CLR(Common Language Runtime) 가상 머신이 IL 코드를 기계어로 변환 후 실행
- C#과 유사한 자바도 컴파일 과정과 인터프리터 과정이 일부 혼합된 형태임

### 3. Visual Studio에서 첫 C# 콘솔 앱 만들기 및 설정
| 작업 | 설명 및 주의점 |
|------|----------------|
| 프로젝트 생성 | Visual Studio 실행 -> "콘솔 앱" 템플릿 선택 -> 프로젝트명 <mark>Hello</mark> 지정 -> 솔루션과 프로젝트를 같은 폴더에 배치 |
| 프레임워크 설정 | .NET 7.0 이상 필요 (.NET 6.0 미지원) |
| 최상위 프로그램 사용 안함 | "최상위 프로그램 사용 안함" 체크 필수 -> 네임스페이스 및 클래스를 명시적으로 선언해야 함 |
| 암시적 <mark>using</mark> 비활성화 | 프로젝트 속성 -> "암시적 using 전체 사용" 해제 -> 직접 <mark>using</mark> 문을 작성하여 참조 관리 |
| 소스 파일명 변경 | 기본 <mark>Program.cs</mark> -> <mark>MainApp.cs</mark> 등으로 변경 후 코드 수정 |

### 4. 첫 프로그램 소스코드 핵심 분석
```cs
using static System.Console;

public class Program
{
    static void Main(string[] args) 
    {
        if (args.Length == 0)
        {
            WriteLine("사용법: Hello.exe [인자]");
            return;
        }
        WriteLine($"Hello {args[0]}");
    }
}
```
- <mark>using static System.Console;</mark> 덕분에 <mark>Console.WriteLine</mark> 대신 <mark>WriteLine</mark>만 사용 가능
- <mark>Main</mark> 메서드
  - 프로그램 시작점으로 반드시 <mark>static void Main(string[] args)</mark> 형태여야 한다.
  - <mark>args</mark>는 커맨드라인 인자를 담은 문자열 배열 (<mark>string[]</mark>)
  - <mark>args.Length == 0</mark> -> 인자가 없으면 사용법 출력 후 종료(<mark>return</mark>)
  - 인자가 있으면 첫 번째 인자(<mark>args[0]</mark>)를 사용해 인사 메시지 출력
- C# 배열의 인덱스는 0부터 시작함 (args[0]은 첫 번째 요소)

### 5. 빌드 및 실행 방법
| 단계 | 설명 |
|------|------|
| 빌드 | Visual Studio의 <mark>빌드</mark> 메뉴 -> <mark>솔루션 빌드</mark> 클릭 또는 단축키 (Ctrl + Shift + B) |
| 실행 파일 위치 | <mark>bin\Debug\net7.0</mark> 폴더 내 <mark>Hello.exe</mark> 또는 인자 포함 실행 (<mark>Hello.exe 상현</mark>) |
- <mark>DIR</mark> 명령어로 디렉터리 내 파일 목록 확인 가능

### 6. 프로그램 실행 흐름과 조건문
- <mark>if (args.Length == 0)</mark>: 인자가 없으면 사용법 출력 후 함수 종료
- <mark>return</mark> 키워드는 메서드 종료를 의미, 이후 코드 실행하지 않음
- 인자가 있으면 <mark>WriteLine($"Hello {args[0]}")</mark> 실행
- <mark>args[0]</mark> 접근 시 배열 범위 내 데이터가 존재해야 하므로 Length 체크 필수

### 7. 유용한 개념 및 용어
| 용어 | 설명 |
|------|------|
| 컴파일러 (Compiler) | 소스코드를 분석해 기계어로 변환하는 프로그램 |
| IL 코드 | Intermediate Language, C# 컴파일러가 생성하는 중간 코드 |
| CLR | Common Language Runtime, IL 코드를 기계어로 변환해 실행하는 가상 머신 |
| <mark>using static</mark> | 특정 클래스의 정적 멤버를 직접 사용할 수 있게 해주는 구문 |
| 배열 인덱스 | 배열의 요소 번호, C#에서는 0부터 시작 |
| <mark>return</mark> 키워드 | 메서드 실행 중간에 종료하고 호출한 곳으로 돌아가는 명령어 |

### 8. 프로그래밍 비유: 컴파일 과정
- 컴파일 과정을 "책 번역"에 비유할 수 있음
  - 어휘 분석: 원문의 단어를 분리해 읽기 쉽게 만듦
  - 구문 분석: 문장이 문법적으로 올바른지 확인
  - 의미 분석: 단어들이 문맥상 맞는지 검토
  - 컴파일러: 원문을 다른 언어(기계어)로 번역하는 번역가
  - CLR: 번역된 책을 독자가 읽을 수 있도록 음성으로 변환해주는 낭독가

### 9. 요점 정리
- C# 프로그램은 <mark>static void Main(string[] args)</mark> 메서드가 실행 시작점
- 컴파일 과정은 어휘, 구문, 의미 분석을 거쳐 IL 코드 생성, CLR이 기계어로 변환해 실행
- Visual Studio에서 프로젝트 생성 시 프레임워크 버전 확인과 설정 주의
- <mark>args</mark> 배열을 통해 커맨드라인 인자 사용 가능하며, 인자 유무에 따라 분기 처리 구현
- <mark>using static</mark> 구문으로 클래스 이름 없이 정적 멤버 접근 가능

<br>
<hr>

첫 C# 프로그램은 컴파일부터 실행까지 전체 과정과 기본 구문 이해에 초점을 맞추어야 하며, 특히 <mark>Main</mark> 메서드, 배열 인덱스, 조건문 활용을 명확히 파악하는 것이 중요하다. 컴파일러와 CLR의 역할 구분은 실행 메커니즘의 기초를 형성하고, Visual Studio 환경 설정은 원활한 개발을 위해 필수적이다.
  
  
  
  
  
  
  