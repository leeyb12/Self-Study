# 딥 러닝을 이용한 자연어 처리 입문

딥러닝 기반 자연어 처리 학습을 위한 실습 폴더입니다.

## 폴더 구조

```text
딥 러닝을 이용한 자연어 처리 입문/
├─ 01. Introduction/
│  └─ 1-4. pandas_numpy_matplotlib.ipynb
└─ 02. Text Preprocessing/
   └─ 2-1. tokenization.ipynb
```

## 학습 내용

| 위치 | 내용 |
| --- | --- |
| `01. Introduction/1-4. pandas_numpy_matplotlib.ipynb` | pandas, NumPy, Matplotlib 기초 실습 |
| `02. Text Preprocessing/2-1. tokenization.ipynb` | 텍스트 전처리와 토큰화 실습 |

## 실행 방법

```powershell
cd "006\딥 러닝을 이용한 자연어 처리 입문"
jupyter notebook
```

## 핵심 개념

- 토큰화는 문장을 단어, 형태소 또는 부분 단어 단위로 나누는 과정입니다.
- 정제와 정규화는 불필요한 표현을 줄이고 같은 의미의 표기를 일관되게 만듭니다.
- 어휘 집합은 토큰을 정수 ID로 연결하며, 모델 입력은 길이와 형태가 맞도록 패딩할 수 있습니다.
- pandas와 NumPy는 데이터를 표와 배열로 처리하고 Matplotlib은 분포와 결과를 시각화합니다.

## 정리 기준

- 장별 폴더를 유지합니다.
- Notebook 파일명은 교재 절 번호와 주제를 함께 남깁니다.
- 데이터 전처리, 시각화, 모델 실습이 추가되면 README에 범위를 갱신합니다.
