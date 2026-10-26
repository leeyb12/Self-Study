# 양의 정수 n이 매개변수로 주어집니다. 
# n × n 배열에 1부터 n2 까지 정수를 인덱스 [0][0]부터 시계방향 나선형으로 배치한 이차원 배열을 return 하는 solution 함수를 작성해 주세요.

def solution(n):
    arr = [[0] * n for _ in range(n)]
    
    top, bottom = 0, n - 1
    left, right = 0, n - 1
    num = 1
    
    while top <= bottom and left <= right:
        # 왼쪽 -> 오른쪽 (위쪽 행)
        for col in range(left, right + 1):
            arr[top][col] = num
            num += 1
        top += 1
        
        # 위 -> 아래 (오른쪽 열)
        for row in range(top, bottom + 1):
            arr[row][right] = num
            num += 1
        right -= 1
        
        # 오른쪽 -> 왼쪽 (아래쪽 행)
        if top <= bottom:
            for col in range(right, left - 1, -1):
                arr[bottom][col] = num
                num += 1
            bottom -= 1
        
        # 아래 -> 위 (왼쪽 열)
        if left <= right:
            for row in range(bottom, top - 1, -1):
                arr[row][left] = num
                num += 1
            left += 1
    
    return arr