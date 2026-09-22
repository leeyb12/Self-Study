# 006 - 머신러닝 / 딥러닝 교재 실습

머신러닝과 딥러닝 관련 교재 실습을 Jupyter Notebook 중심으로 정리하는 폴더입니다.

머신러닝 개념을 이론으로만 정리하지 않고, 장별 노트북을 통해 데이터 전처리, 모델 학습, 평가, 자연어 처리 입문 도구 사용을 직접 실행하며 확인하는 것을 목표로 합니다.

## 폴더 구조

```text
006/
├─ 딥 러닝을 이용한 자연어 처리 입문/
│  ├─ 01. Introduction/
│  │  └─ 1-4. pandas_numpy_matplotlib.ipynb
│  └─ 02. Text Preprocessing/
│     └─ 2-1. tokenization.ipynb
├─ 머신 러닝 교과서 3판/
│  ├─ ch01.ipynb
│  ├─ ch02.ipynb
│  ├─ ch03.ipynb
│  ├─ ch04.ipynb
│  ├─ ch04a.ipynb
│  ├─ ch05.ipynb
│  ├─ ch06.ipynb
│  ├─ ch06a.ipynb
│  ├─ ch07.ipynb
│  ├─ ch08.ipynb
│  └─ ch08a.ipynb
└─ README.md
```

## 학습 내용

| 파일 | 내용 |
| --- | --- |
| `딥 러닝을 이용한 자연어 처리 입문/01. Introduction/1-4. pandas_numpy_matplotlib.ipynb` | pandas, NumPy, Matplotlib 기초 실습 |
| `딥 러닝을 이용한 자연어 처리 입문/02. Text Preprocessing/2-1. tokenization.ipynb` | 자연어 처리 전처리와 토큰화 실습 |
| `ch01.ipynb` | 머신러닝 기본 개념과 학습 흐름 |
| `ch02.ipynb` | 분류 알고리즘과 기초 모델 실습 |
| `ch03.ipynb` | 사이킷런 기반 분류 모델과 평가 |
| `ch04.ipynb` | 데이터 전처리와 특성 처리 |
| `ch04a.ipynb` | ch04 보충 실습 |
| `ch05.ipynb` | 차원 축소와 특성 추출 |
| `ch06.ipynb` | 모델 평가와 하이퍼파라미터 튜닝 |
| `ch06a.ipynb` | ch06 보충 실습 |
| `ch07.ipynb` | 앙상블 학습 |
| `ch08.ipynb` | 텍스트 데이터 처리와 감성 분석 기초 |
| `ch08a.ipynb` | ch08 보충 실습 |

## 핵심 개념

- 지도 학습은 입력 특성과 정답의 관계를 학습하며 분류와 회귀가 대표적인 문제입니다.
- 전처리와 특성 선택은 모델이 학습할 정보의 품질을 결정합니다.
- 교차 검증과 평가 지표는 한 번의 데이터 분할에 치우치지 않고 모델 성능을 비교하는 도구입니다.
- 차원 축소는 정보 손실을 관리하면서 특성 수를 줄이고, 앙상블은 여러 모델의 판단을 결합합니다.
- 자연어 처리는 문장을 모델이 처리할 토큰과 수치 표현으로 바꾸는 과정에서 시작합니다.

## 정리 기준

- 각 Notebook은 장별 실습 흐름을 유지합니다.
- 중요한 개념은 Markdown 셀로 요약합니다.
- 모델 학습 결과는 실행 출력과 함께 남깁니다.
- 헷갈리는 개념은 별도 메모로 정리합니다.

## 실행 방법

Jupyter 환경에서 노트북을 열어 실행합니다.

```powershell
cd "006\머신 러닝 교과서 3판"
jupyter notebook
```

자연어 처리 입문 실습은 해당 교재 폴더에서 실행합니다.

```powershell
cd "006\딥 러닝을 이용한 자연어 처리 입문"
jupyter notebook
```
