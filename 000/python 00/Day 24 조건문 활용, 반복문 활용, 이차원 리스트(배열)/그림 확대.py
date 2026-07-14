# 직사각형 형태의 그림 파일이 있고, 이 그림 파일은 1 × 1 크기의 정사각형 크기의 픽셀로 이루어져 있습니다. 
# 이 그림 파일을 나타낸 문자열 배열 picture과 정수 k가 매개변수로 주어질 때, 이 그림 파일을 가로 세로로 k배 늘린 
# 그림 파일을 나타내도록 문자열 배열을 return 하는 solution 함수를 작성해 주세요.

def solution(picture, k):
    result = []
    for row in picture:
        # 각 문자를 k번씩 반복해서 가로로 k배 확장
        expanded_row = ''.join(ch * k for ch in row)
        # 그 행을 세로로 k번 반복해서 추가
        for _ in range(k):
            result.append(expanded_row)
    return result