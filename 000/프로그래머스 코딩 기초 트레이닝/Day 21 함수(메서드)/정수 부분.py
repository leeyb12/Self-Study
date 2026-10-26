# 실수 flo가 매개 변수로 주어질 때, flo의 정수 부분을 return하도록 solution 함수를 완성해주세요.

import math

def solution(flo):
    return math.floor(flo) if flo >= 0 else math.ceil(flo)