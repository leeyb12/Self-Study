# 문자열 myString과 pat이 주어집니다. myString에서 pat이 등장하는 횟수를 return 하는 solution 함수를 완성해 주세요.

solution = lambda x, y : sum (1 for i in range(len(x)) if x[i:i+len(y)]==y)