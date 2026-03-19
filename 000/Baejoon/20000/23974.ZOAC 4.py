import math

H, W, N, M = map(int, input().split())

ans = math.ceil(H / (N + 1)) * math.ceil(W / (M + 1))
print(ans)