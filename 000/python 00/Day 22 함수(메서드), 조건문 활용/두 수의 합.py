# 0 이상의 두 정수가 문자열 a, b로 주어질 때, a + b의 값을 문자열로 return 하는 solution 함수를 작성해 주세요.

def solution(a, b):
    a = a[::-1]  # 뒤집어서 1의 자리부터 계산
    b = b[::-1]
    
    n = max(len(a), len(b))
    result = []
    carry = 0
    
    for i in range(n):
        digit_a = int(a[i]) if i < len(a) else 0
        digit_b = int(b[i]) if i < len(b) else 0
        
        total = digit_a + digit_b + carry
        result.append(str(total % 10))
        carry = total // 10
    
    if carry:
        result.append(str(carry))
    
    return ''.join(result[::-1])