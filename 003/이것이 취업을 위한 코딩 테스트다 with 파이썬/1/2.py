from random import randint
import time

# 배열에 10,000개의 정수를 삽입
array = []
for _ in range(10000):
    array.append(randint(1, 100))  # 1부터 100 사이의 랜덤한 정수

# 선택 정렬 프로그램 성능 측정
for i in range(len(array)):
    min_index = i  # 가장 작은 원소의 인덱스