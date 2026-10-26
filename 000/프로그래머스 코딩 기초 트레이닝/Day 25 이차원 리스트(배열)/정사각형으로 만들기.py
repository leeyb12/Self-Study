# 이차원 정수 배열 arr이 매개변수로 주어집니다. arr의 행의 수가 더 많다면 열의 수가 행의 수와 같아지도록 각 행의 끝에 0을 추가하고, 
# 열의 수가 더 많다면 행의 수가 열의 수와 같아지도록 각 열의 끝에 0을 추가한 이차원 배열을 return 하는 solution 함수를 작성해 주세요.

def solution(arr):
    n_rows = len(arr)
    n_cols = len(arr[0])
    
    if n_rows > n_cols:
        # 열의 수를 행의 수와 같게 -> 각 행 끝에 0 추가
        result = [row + [0] * (n_rows - n_cols) for row in arr]
    elif n_cols > n_rows:
        # 행의 수를 열의 수와 같게 -> 0으로 채운 행 추가
        result = [row[:] for row in arr]
        for _ in range(n_cols - n_rows):
            result.append([0] * n_cols)
    else:
        result = [row[:] for row in arr]
    
    return result